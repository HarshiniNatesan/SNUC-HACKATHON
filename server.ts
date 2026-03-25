import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Mock Database
  const db_mock = {
    users: [],
    sectors: ['Baker', 'Mehandi Artist', 'Handicrafts', 'Tailor', 'Tuition Center'],
    tuitionData: {
      students: [],
      mentors: [],
      expenses: []
    }
  };

  // Auth Routes
  app.post("/api/auth/signup", (req, res) => {
    const { name, email, password, phone } = req.body;
    const newUser = { id: Date.now(), name, email, phone };
    db_mock.users.push(newUser);
    res.json({ success: true, user: newUser });
  });

  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    res.json({ success: true, user: { name: "Admin Teacher", email } });
  });

  // Tuition Center Data Routes
  app.get("/api/tuition/data", (req, res) => {
    res.json(db_mock.tuitionData);
  });

  app.post("/api/tuition/students", (req, res) => {
    const student = { id: Date.now(), ...req.body };
    db_mock.tuitionData.students.push(student);
    res.json({ success: true, student });
  });

  app.post("/api/tuition/mentors", (req, res) => {
    const mentor = { id: Date.now(), ...req.body };
    db_mock.tuitionData.mentors.push(mentor);
    res.json({ success: true, mentor });
  });

  app.post("/api/tuition/expenses", (req, res) => {
    const expense = { id: Date.now(), ...req.body };
    db_mock.tuitionData.expenses.push(expense);
    res.json({ success: true, expense });
  });

  app.get("/api/tuition/students", (req, res) => {
    res.json(db_mock.tuitionData.students);
  });

  app.put("/api/tuition/students/:id", (req, res) => {
    const { id } = req.params;
    const index = db_mock.tuitionData.students.findIndex(s => s.id === Number(id));
    if (index !== -1) {
      db_mock.tuitionData.students[index] = { ...db_mock.tuitionData.students[index], ...req.body };
      res.json({ success: true, student: db_mock.tuitionData.students[index] });
    } else {
      res.status(404).json({ error: "Student not found" });
    }
  });

  app.get("/api/finances/summary", (req, res) => {
    const { students, mentors, expenses } = db_mock.tuitionData;
    
    const currentCash = students.reduce((sum, s) => sum + Number(s.paidFees), 0);
    const totalMentorSalaries = mentors.reduce((sum, m) => sum + Number(m.salary), 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
    const totalPayables = totalExpenses; // User: "total payables is the total amount of expenses"
    const totalObligations = totalExpenses + totalMentorSalaries;
    
    // Profit & Loss calculation
    const totalRevenue = students.reduce((sum, s) => sum + Number(s.totalFees), 0);
    const profitLoss = totalRevenue - totalObligations;
    const profitMargin = totalRevenue > 0 ? (profitLoss / totalRevenue) * 100 : 0;

    let remainingCash = currentCash;
    const prioritized: any[] = [];
    const reasoning: string[] = [];

    // 1. Mandatory Expenses First (Special Mentions)
    const mandatoryExpenses = expenses.filter(e => e.isMandatory);
    mandatoryExpenses.forEach(e => {
      if (remainingCash >= e.amount) {
        prioritized.push({ ...e, category: e.name, date: e.dueDate, priority: 'high', status: 'payable', type: 'mandatory' });
        reasoning.push(`${e.name} (Mandatory) has been fully allocated.`);
        remainingCash -= e.amount;
      } else if (remainingCash > 0) {
        prioritized.push({ ...e, category: e.name, date: e.dueDate, priority: 'high', status: 'partial', partialAmount: remainingCash, type: 'mandatory' });
        reasoning.push(`${e.name} (Mandatory) partially funded with ₹${Math.floor(remainingCash)}.`);
        remainingCash = 0;
      } else {
        prioritized.push({ ...e, category: e.name, date: e.dueDate, priority: 'high', status: 'deferred', type: 'mandatory' });
        reasoning.push(`${e.name} (Mandatory) deferred due to zero funds.`);
      }
    });

    // 2. Full Salaries if enough money for all obligations, otherwise Partial
    const partialSalaryPercentage = 0.5;
    
    // If we have enough for all expenses + full salaries, pay full.
    // User request: "if i have enough money to deal with expenses then need not to give partial salary"
    const canPayFullSalaries = remainingCash >= totalMentorSalaries;

    if (remainingCash > 0) {
      mentors.forEach(m => {
        const fullAmount = Number(m.salary);
        const partialAmount = fullAmount * partialSalaryPercentage;
        
        if (canPayFullSalaries) {
          prioritized.push({
            id: `m-full-${m.id}`,
            category: `Full Salary: ${m.name}`,
            amount: fullAmount,
            priority: 'high',
            date: '2026-03-31',
            type: 'salary',
            status: 'payable'
          });
          reasoning.push(`Full salary allocated to ${m.name} as funds are sufficient for expenses.`);
          remainingCash -= fullAmount;
        } else if (remainingCash >= partialAmount) {
          prioritized.push({
            id: `m-partial-${m.id}`,
            category: `Partial Salary (50%): ${m.name}`,
            amount: partialAmount,
            priority: 'high',
            date: '2026-03-31',
            type: 'salary',
            status: 'payable'
          });
          reasoning.push(`Allocated 50% salary to ${m.name} to preserve cash for mandatory obligations.`);
          remainingCash -= partialAmount;
        } else if (remainingCash > 0) {
          prioritized.push({
            id: `m-partial-${m.id}`,
            category: `Emergency Partial Salary: ${m.name}`,
            amount: partialAmount,
            partialAmount: remainingCash,
            priority: 'high',
            date: '2026-03-31',
            type: 'salary',
            status: 'partial'
          });
          reasoning.push(`Emergency: ${m.name} receives ₹${Math.floor(remainingCash)}.`);
          remainingCash = 0;
        }
      });
    }

    // 3. Remaining Obligations (Non-mandatory expenses sorted by Interest, then remaining salaries)
    const nonMandatoryExpenses = expenses.filter(e => !e.isMandatory).map(e => ({
      ...e,
      category: e.name,
      date: e.dueDate,
      type: 'expense',
      sortPriority: Number(e.interest) * 10
    }));

    const remainingSalaries = canPayFullSalaries ? [] : mentors.map(m => ({
      id: `m-bal-${m.id}`,
      category: `Remaining Salary (50%): ${m.name}`,
      amount: Number(m.salary) * (1 - partialSalaryPercentage),
      priority: 'medium',
      date: '2026-03-31',
      type: 'salary_balance',
      sortPriority: 5
    }));

    const otherObligations = [...nonMandatoryExpenses, ...remainingSalaries].sort((a, b) => b.sortPriority - a.sortPriority);

    otherObligations.forEach(t => {
      if (remainingCash >= t.amount) {
        prioritized.push({ ...t, status: 'payable', priority: t.sortPriority > 10 ? 'high' : 'medium' });
        reasoning.push(`${t.category} allocated based on interest/priority ranking.`);
        remainingCash -= t.amount;
      } else if (remainingCash > 0) {
        prioritized.push({ ...t, status: 'partial', partialAmount: remainingCash, priority: 'medium' });
        reasoning.push(`${t.category} partially funded with ₹${Math.floor(remainingCash)}.`);
        remainingCash = 0;
      } else {
        prioritized.push({ ...t, status: 'deferred', priority: 'low' });
        reasoning.push(`${t.category} deferred to next cycle.`);
      }
    });

    let strategySummary = "Your finances are healthy. All obligations can be met.";
    if (currentCash < totalPayables + totalMentorSalaries) {
      if (currentCash < totalPayables) {
        strategySummary = "Critical shortage detected. Prioritizing mandatory expenses and deferring non-essential payments.";
      } else {
        strategySummary = "Cash is tight. Paying mandatory expenses and partial salaries to maintain stability.";
      }
    }

    res.json({
      cashBalance: currentCash,
      totalPayables,
      prioritized,
      reasoning,
      shortage: currentCash < totalPayables ? totalPayables - currentCash : 0,
      daysToZero: Math.floor(currentCash / (totalPayables / 30 || 1)),
      profitLoss,
      profitMargin,
      totalRevenue,
      strategySummary
    });
  });

  app.get("/api/transactions", (req, res) => {
    const { students, expenses, mentors } = db_mock.tuitionData;
    const studentTrans = students.map(s => ({
      id: `s-${s.id}`,
      type: 'income',
      category: `Fees: ${s.name}`,
      amount: s.paidFees,
      date: new Date().toISOString()
    }));
    const expenseTrans = expenses.map(e => ({
      id: `e-${e.id}`,
      type: 'expense',
      category: e.name,
      amount: e.amount,
      date: e.dueDate
    }));
    const mentorTrans = mentors.map(m => ({
      id: `m-${m.id}`,
      type: 'expense',
      category: `Salary: ${m.name}`,
      amount: m.salary,
      date: '2026-03-31'
    }));
    res.json([...studentTrans, ...expenseTrans, ...mentorTrans]);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
