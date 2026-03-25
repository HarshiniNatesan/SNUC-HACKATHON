import React, { useState, useEffect, Component } from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  Send, 
  FileText, 
  Plus,
  LogOut,
  User,
  Phone,
  Mail,
  Lock,
  ChevronRight,
  BarChart3,
  MessageSquare,
  TrendingUp,
  Camera,
  Sparkles,
  Brain,
  Calendar,
  Zap
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';

// --- Types ---
interface Transaction {
  id: number;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  source?: string;
  status?: string;
  priority?: 'high' | 'medium' | 'low';
}

import { GoogleGenAI } from "@google/genai";

interface FinanceSummary {
  cashBalance: number;
  totalPayables: number;
  prioritized: Transaction[];
  reasoning: string[];
  daysToZero: number;
  shortage: number;
  profitLoss: number;
  profitMargin: number;
  totalRevenue: number;
  strategySummary: string;
}

// --- Components ---

const AuthScreen = ({ onLogin }: { onLogin: (user: any) => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    const data = await res.json();
    if (data.success) onLogin(data.user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Business Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.4) saturate(0.8)'
        }}
      />
      
      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-slate-900/60 z-1" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass-card p-8 relative z-10 backdrop-blur-xl bg-white/80 border-white/20"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-indigo-200">
            <Wallet className="text-white w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">RUPEE RADAR</h1>
          <p className="text-slate-500 text-sm">Financial Intelligence for Your Business</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="input-field pl-10"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input 
                type="email" 
                placeholder="teacher@center.com" 
                className="input-field pl-10"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
          </div>
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                <input 
                  type="tel" 
                  placeholder="+91 98765 43210" 
                  className="input-field pl-10"
                  value={formData.phone}
                  onChange={e => setFormData({...formData, phone: e.target.value})}
                  required
                />
              </div>
            </div>
          )}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
              <input 
                type="password" 
                placeholder="••••••••" 
                className="input-field pl-10"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 mt-4 text-lg">
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-medium hover:underline text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

interface Prediction {
  monthly: {
    profit: number;
    growth: number;
    confidence: number;
    insight: string;
  };
  yearly: {
    profit: number;
    growth: number;
    confidence: number;
    insight: string;
  };
}

const Dashboard = ({ user, onLogout }: { user: any, onLogout: () => void }) => {
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<Prediction | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, transRes, studRes] = await Promise.all([
        fetch('/api/finances/summary'),
        fetch('/api/transactions'),
        fetch('/api/tuition/students')
      ]);
      
      if (!sumRes.ok || !transRes.ok || !studRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const summaryData = await sumRes.json();
      const transactionsData = await transRes.json();
      const studentsData = await studRes.json();

      setSummary(summaryData);
      setTransactions(transactionsData);
      setStudents(studentsData);
      
      // Fetch ML predictions after data is loaded
      generateMLPredictions(summaryData, studentsData);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Failed to load financial data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const generateMLPredictions = async (sum: FinanceSummary, studs: any[]) => {
    setIsPredicting(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `
        Analyze this tuition center financial data and predict profit for 1 month and 1 year.
        Current Summary: ${JSON.stringify(sum)}
        Students: ${JSON.stringify(studs)}
        
        Return ONLY a JSON object with this structure:
        {
          "monthly": { "profit": number, "growth": number, "confidence": number, "insight": "string" },
          "yearly": { "profit": number, "growth": number, "confidence": number, "insight": "string" }
        }
        Confidence should be 0-100. Growth is percentage.
      `;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }] }],
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text || '{}');
      setPredictions(result);
    } catch (err) {
      console.error('Prediction error:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleBankStatementUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setScanError(null);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              parts: [
                { text: "Extract the 'Student Name' and 'Amount Paid' from this bank statement image. Return ONLY a JSON object with keys 'name' and 'amount'. If not found, return null." },
                { inlineData: { mimeType: file.type, data: base64Data } }
              ]
            }
          ],
          config: { responseMimeType: "application/json" }
        });

        const result = JSON.parse(response.text || '{}');
        if (result.name && result.amount) {
          const student = students.find(s => s.name.toLowerCase().includes(result.name.toLowerCase()));
          if (!student) {
            setScanError(`Student "${result.name}" not found in your records. Please verify.`);
          } else {
            // Update student paid fees
            const updatedStudent = { ...student, paidFees: Number(student.paidFees) + Number(result.amount) };
            await fetch(`/api/tuition/students/${student.id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(updatedStudent)
            });
            fetchData();
            alert(`Successfully recorded ₹${result.amount} for ${student.name}`);
          }
        } else {
          setScanError("Could not extract payment details from the image.");
        }
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setScanError("Failed to process image. Please try again.");
      setIsScanning(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-slate-600 font-medium">Analyzing your finances...</p>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 p-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold text-slate-900 mb-2">Data Fetch Error</h2>
        <p className="text-slate-600 mb-6">{error || 'Unable to load financial summary.'}</p>
        <button onClick={fetchData} className="btn-primary">Retry Loading</button>
      </div>
    );
  }

  const chartData = [
    { name: 'Cash', value: summary.cashBalance },
    { name: 'Payables', value: summary.totalPayables },
  ];

  const COLORS = ['#4f46e5', '#ef4444'];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col hidden md:flex">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Wallet className="text-white w-6 h-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">RUPEE RADAR</span>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="flex items-center gap-3 w-full p-3 bg-indigo-50 text-indigo-600 rounded-xl font-medium">
            <LayoutDashboard className="w-5 h-5" /> Dashboard
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <FileText className="w-5 h-5" /> Invoices
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <BarChart3 className="w-5 h-5" /> Analytics
          </button>
          <button className="flex items-center gap-3 w-full p-3 text-slate-500 hover:bg-slate-50 rounded-xl font-medium transition-colors">
            <MessageSquare className="w-5 h-5" /> Reminders
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-slate-500" />
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="font-semibold text-sm truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="flex items-center gap-3 w-full p-3 text-red-500 hover:bg-red-50 rounded-xl font-medium transition-colors"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Financial Overview</h2>
            <p className="text-slate-500">Welcome back, {user.name.split(' ')[0]}</p>
          </div>
          <div className="flex gap-3">
            <button className="btn-primary flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Transaction
            </button>
            <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-all font-medium flex items-center gap-2">
              <FileText className="w-4 h-4" /> Upload Statement
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 border-l-4 border-l-indigo-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium text-sm">Current Salary (from Fees)</span>
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">₹{summary.cashBalance.toLocaleString()}</h3>
            <p className="text-emerald-600 text-sm font-medium flex items-center gap-1 mt-2">
              <ArrowUpRight className="w-4 h-4" /> +12% from last month
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 border-l-4 border-l-red-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium text-sm">Total Expenses</span>
              <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <ArrowDownLeft className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">₹{summary.totalPayables.toLocaleString()}</h3>
            <p className="text-red-600 text-sm font-medium flex items-center gap-1 mt-2">
              <AlertCircle className="w-4 h-4" /> Due within 7 days
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 border-l-4 border-l-amber-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium text-sm">Shortage Amount</span>
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">₹{summary.shortage.toLocaleString()}</h3>
            <p className={`text-sm font-medium flex items-center gap-1 mt-2 ${summary.shortage > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
              {summary.shortage > 0 ? 'Immediate action required' : 'Cash flow is healthy'}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -4 }}
            className="glass-card p-6 border-l-4 border-l-emerald-500"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 font-medium text-sm">Profit / Loss (Projected)</span>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <h3 className={`text-3xl font-bold ${summary.profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              ₹{summary.profitLoss.toLocaleString()}
            </h3>
            <p className="text-sm font-medium text-slate-500 mt-2">
              Margin: {summary.profitMargin.toFixed(1)}%
            </p>
          </motion.div>
        </div>

        {summary.shortage > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex gap-4 items-center shadow-sm"
          >
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-red-900">Financial Shortage Alert</h4>
              <p className="text-sm text-red-700">You are short of ₹{summary.shortage.toLocaleString()} to meet all current obligations. Review the prioritized payment plan below.</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors">
              View Solutions
            </button>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Decision Engine */}
          <div className="lg:col-span-2 space-y-8">
            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" /> Predictive Decision Engine
                </h3>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-600 px-2 py-1 rounded-full uppercase">Autonomous Insights</span>
              </div>

              <div className="mb-6 p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                <p className="text-sm font-semibold text-indigo-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-600" /> Current Strategy:
                </p>
                <p className="text-sm text-indigo-700 mt-1">{summary.strategySummary}</p>
              </div>

              <div className="space-y-4">
                {summary.prioritized.length > 0 ? (
                  summary.prioritized.map((t, idx) => (
                    <div key={t.id} className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            t.priority === 'high' ? 'bg-red-500' : 
                            t.priority === 'medium' ? 'bg-amber-500' : 'bg-slate-400'
                          }`} />
                          <span className="font-bold text-slate-800">{t.category}</span>
                          {t.status === 'partial' && (
                            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">Partial</span>
                          )}
                          {t.status === 'deferred' && (
                            <span className="text-[10px] font-bold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full uppercase">Deferred</span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-bold block">₹{t.amount.toLocaleString()}</span>
                          {t.status === 'partial' && (
                            <span className="text-[10px] text-slate-500">Paying: ₹{t.partialAmount?.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-slate-600 italic mb-3 bg-white/50 p-2 rounded-lg border border-slate-100">
                        "{summary.reasoning[idx]}"
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Due: {(() => {
                            try {
                              return format(new Date(t.date || '2026-03-31'), 'MMM dd, yyyy');
                            } catch (e) {
                              return 'TBD';
                            }
                          })()}
                        </span>
                        <div className="flex gap-2">
                          <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors border border-indigo-100">Pay Now</button>
                          <button className="text-xs font-bold text-slate-500 hover:bg-slate-100 px-3 py-1.5 rounded-lg transition-colors border border-slate-200">Reschedule</button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-50" />
                    <p className="text-slate-500 font-medium">No pending obligations or suggestions at this time.</p>
                  </div>
                )}
              </div>

              {summary.cashBalance < summary.totalPayables && (
                <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-red-900">Shortfall Warning</p>
                    <p className="text-xs text-red-700">Available cash is insufficient for all upcoming obligations. System recommends prioritizing High-priority payments and deferring Rent by 2 days.</p>
                  </div>
                </div>
              )}
            </section>

            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-600" /> Student Management
                </h3>
                <label className="cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100">
                  <Camera className="w-4 h-4" />
                  {isScanning ? 'Scanning...' : 'Scan Bank Statement'}
                  <input type="file" className="hidden" accept="image/*" onChange={handleBankStatementUpload} disabled={isScanning} />
                </label>
              </div>

              {scanError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs font-medium border border-red-100 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {scanError}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="pb-3 font-semibold">Student</th>
                      <th className="pb-3 font-semibold">Grade</th>
                      <th className="pb-3 font-semibold">Total</th>
                      <th className="pb-3 font-semibold">Paid</th>
                      <th className="pb-3 font-semibold text-right">Pending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map(s => (
                      <tr key={s.id} className="text-sm">
                        <td className="py-4 font-medium">{s.name}</td>
                        <td className="py-4 text-slate-500">{s.grade}</td>
                        <td className="py-4 font-mono">₹{Number(s.totalFees).toLocaleString()}</td>
                        <td className="py-4 font-mono text-emerald-600 font-bold">₹{Number(s.paidFees).toLocaleString()}</td>
                        <td className="py-4 text-right font-mono text-red-500 font-bold">₹{Number(s.pendingFees).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="pb-3 font-semibold">Date</th>
                      <th className="pb-3 font-semibold">Category</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {transactions.map(t => (
                      <tr key={t.id} className="text-sm">
                        <td className="py-4 text-slate-500">
                          {(() => {
                            try {
                              return format(new Date(t.date), 'MMM dd');
                            } catch (e) {
                              return 'N/A';
                            }
                          })()}
                        </td>
                        <td className="py-4 font-medium">{t.category}</td>
                        <td className="py-4">
                          <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                            t.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className={`py-4 text-right font-mono font-bold ${
                          t.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Side Panel: Actions & Charts */}
          <div className="space-y-8">
            <section className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6">Cash Flow Analysis</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-600" />
                  <span className="text-xs text-slate-500">Cash</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs text-slate-500">Payables</span>
                </div>
              </div>
            </section>

            <section className="glass-card p-6">
              <h3 className="text-lg font-bold mb-6">Action Center</h3>
              <div className="space-y-4">
                <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Send className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Fee Reminders</p>
                      <p className="text-xs text-slate-500">12 Pending students</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Mail className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Reschedule Drafts</p>
                      <p className="text-xs text-slate-500">Rent & Utilities</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>

                <button className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl border border-slate-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-bold">Approve Salaries</p>
                      <p className="text-xs text-slate-500">3 Teachers pending</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                </button>
              </div>
            </section>
            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Brain className="w-5 h-5 text-indigo-600" /> ML Profit Radar
                </h3>
                {isPredicting && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />}
              </div>

              {predictions ? (
                <div className="space-y-6">
                  <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Monthly Forecast
                      </span>
                      <span className="text-[10px] font-bold bg-white text-indigo-600 px-2 py-0.5 rounded-full border border-indigo-100">
                        {predictions.monthly.confidence}% Conf.
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-2xl font-bold text-slate-900">₹{predictions.monthly.profit.toLocaleString()}</h4>
                      <span className={`text-xs font-bold ${predictions.monthly.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {predictions.monthly.growth >= 0 ? '+' : ''}{predictions.monthly.growth}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 italic leading-relaxed">
                      "{predictions.monthly.insight}"
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                        <Zap className="w-3 h-3" /> Annual Projection
                      </span>
                      <span className="text-[10px] font-bold bg-slate-800 text-indigo-400 px-2 py-0.5 rounded-full border border-slate-700">
                        {predictions.yearly.confidence}% Conf.
                      </span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <h4 className="text-2xl font-bold text-white">₹{predictions.yearly.profit.toLocaleString()}</h4>
                      <span className={`text-xs font-bold ${predictions.yearly.growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                        {predictions.yearly.growth >= 0 ? '+' : ''}{predictions.yearly.growth}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 italic leading-relaxed">
                      "{predictions.yearly.insight}"
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <Brain className="w-10 h-10 text-slate-300 mx-auto mb-3 animate-pulse" />
                  <p className="text-slate-500 text-sm">Analyzing market trends and your data...</p>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

const SectorSelection = ({ onSelect }: { onSelect: (sector: string) => void }) => {
  const sectors = [
    { name: 'Tuition Center', icon: LayoutDashboard, color: 'bg-indigo-600', active: true },
    { name: 'Baker', icon: Wallet, color: 'bg-amber-500', active: false },
    { name: 'Mehandi Artist', icon: User, color: 'bg-pink-500', active: false },
    { name: 'Handicrafts', icon: FileText, color: 'bg-emerald-500', active: false },
    { name: 'Tailor', icon: BarChart3, color: 'bg-slate-600', active: false },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Business Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2069")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.5) saturate(0.7)'
        }}
      />
      
      {/* Decorative Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/30 to-slate-900/50 z-1" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl glass-card p-8 relative z-10 backdrop-blur-xl bg-white/90 border-white/20"
      >
        <h2 className="text-3xl font-bold text-center mb-2">Choose Your Sector</h2>
        <p className="text-slate-500 text-center mb-10">Select your business type to get started</p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sectors.map((sector) => (
            <button
              key={sector.name}
              onClick={() => sector.active && onSelect(sector.name)}
              className={`p-6 rounded-2xl border-2 transition-all text-left flex flex-col gap-4 ${
                sector.active 
                  ? 'border-indigo-100 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-100 bg-white' 
                  : 'border-slate-100 opacity-50 cursor-not-allowed bg-slate-50'
              }`}
            >
              <div className={`w-12 h-12 ${sector.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                <sector.icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg">{sector.name}</h3>
                <p className="text-sm text-slate-500">
                  {sector.active ? 'Available now' : 'Coming soon'}
                </p>
              </div>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const SetupWizard = ({ sector, onComplete }: { sector: string, onComplete: () => void }) => {
  const [step, setStep] = useState(1);
  const [students, setStudents] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);

  const [studentForm, setStudentForm] = useState({ name: '', grade: '', totalFees: '', paidFees: '' });
  const [mentorForm, setMentorForm] = useState({ name: '', subject: '', salary: '' });
  const [expenseForm, setExpenseForm] = useState({ name: '', amount: '', interest: '', dueDate: '', isMandatory: false });

  const addStudent = async () => {
    const pendingFees = Number(studentForm.totalFees) - Number(studentForm.paidFees);
    const res = await fetch('/api/tuition/students', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...studentForm, pendingFees })
    });
    if (res.ok) {
      setStudents([...students, { ...studentForm, pendingFees }]);
      setStudentForm({ name: '', grade: '', totalFees: '', paidFees: '' });
    }
  };

  const addMentor = async () => {
    const res = await fetch('/api/tuition/mentors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mentorForm)
    });
    if (res.ok) {
      setMentors([...mentors, mentorForm]);
      setMentorForm({ name: '', subject: '', salary: '' });
    }
  };

  const addExpense = async () => {
    const res = await fetch('/api/tuition/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseForm)
    });
    if (res.ok) {
      setExpenses([...expenses, expenseForm]);
      setExpenseForm({ name: '', amount: '', interest: '', dueDate: '', isMandatory: false });
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* Business Background Image */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1454165833767-027ffea9e778?auto=format&fit=crop&q=80&w=2070")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6) saturate(0.6)'
        }}
      />
      
      <div className="w-full max-w-2xl relative z-10">
        {/* Progress Bar */}
        <div className="flex justify-between mb-8 relative">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((s) => (
            <div 
              key={s}
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                step >= s ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border-2 border-slate-200'
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div 
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold mb-2">Student Details</h3>
              <p className="text-slate-500 mb-6">Add students currently enrolled in your tuition center</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input placeholder="Student Name" className="input-field col-span-2" value={studentForm.name} onChange={e => setStudentForm({...studentForm, name: e.target.value})} />
                <input placeholder="Grade" className="input-field" value={studentForm.grade} onChange={e => setStudentForm({...studentForm, grade: e.target.value})} />
                <input type="number" placeholder="Total Fees" className="input-field" value={studentForm.totalFees} onChange={e => setStudentForm({...studentForm, totalFees: e.target.value})} />
                <input type="number" placeholder="Paid Fees" className="input-field" value={studentForm.paidFees} onChange={e => setStudentForm({...studentForm, paidFees: e.target.value})} />
                <button onClick={addStudent} className="btn-primary col-span-2 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Student
                </button>
              </div>

              <div className="overflow-x-auto mb-8 rounded-2xl border border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="table-header">Student Name</th>
                      <th className="table-header">Grade</th>
                      <th className="table-header">Total Fees</th>
                      <th className="table-header">Paid Fees</th>
                      <th className="table-header">Pending</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {students.map((s, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="table-cell font-medium">{s.name}</td>
                        <td className="table-cell">{s.grade}</td>
                        <td className="table-cell">₹{s.totalFees}</td>
                        <td className="table-cell text-emerald-600 font-bold">₹{s.paidFees}</td>
                        <td className="table-cell text-red-500 font-bold">₹{s.pendingFees}</td>
                      </tr>
                    ))}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan={5} className="table-cell text-center text-slate-400 py-8">No students added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <button onClick={() => setStep(2)} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                Next: Mentor Details <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold mb-2">Mentor Details</h3>
              <p className="text-slate-500 mb-6">Add teachers and staff members</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input placeholder="Mentor Name" className="input-field col-span-2" value={mentorForm.name} onChange={e => setMentorForm({...mentorForm, name: e.target.value})} />
                <input placeholder="Subject" className="input-field" value={mentorForm.subject} onChange={e => setMentorForm({...mentorForm, subject: e.target.value})} />
                <input type="number" placeholder="Salary" className="input-field" value={mentorForm.salary} onChange={e => setMentorForm({...mentorForm, salary: e.target.value})} />
                <button onClick={addMentor} className="btn-primary col-span-2 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Mentor
                </button>
              </div>

              <div className="overflow-x-auto mb-8 rounded-2xl border border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="table-header">Mentor Name</th>
                      <th className="table-header">Subject</th>
                      <th className="table-header">Salary</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mentors.map((m, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="table-cell font-medium">{m.name}</td>
                        <td className="table-cell">{m.subject}</td>
                        <td className="table-cell font-bold">₹{m.salary}</td>
                      </tr>
                    ))}
                    {mentors.length === 0 && (
                      <tr>
                        <td colSpan={3} className="table-cell text-center text-slate-400 py-8">No mentors added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(1)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold">Back</button>
                <button onClick={() => setStep(3)} className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  Next: Financial Management <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass-card p-8"
            >
              <h3 className="text-2xl font-bold mb-2">Financial Management</h3>
              <p className="text-slate-500 mb-6">Enter your upcoming expenses and obligations</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <input placeholder="Expense Name (e.g. Rent)" className="input-field col-span-2" value={expenseForm.name} onChange={e => setExpenseForm({...expenseForm, name: e.target.value})} />
                <input type="number" placeholder="Amount to be Paid" className="input-field" value={expenseForm.amount} onChange={e => setExpenseForm({...expenseForm, amount: e.target.value})} />
                <input type="number" placeholder="Interest for Delay (%)" className="input-field" value={expenseForm.interest} onChange={e => setExpenseForm({...expenseForm, interest: e.target.value})} />
                <input type="date" className="input-field col-span-2" value={expenseForm.dueDate} onChange={e => setExpenseForm({...expenseForm, dueDate: e.target.value})} />
                <div className="col-span-2 flex items-center gap-3 p-3 bg-white/50 rounded-xl border border-slate-200">
                  <input 
                    type="checkbox" 
                    id="mandatory" 
                    className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    checked={expenseForm.isMandatory}
                    onChange={e => setExpenseForm({...expenseForm, isMandatory: e.target.checked})}
                  />
                  <label htmlFor="mandatory" className="text-sm font-medium text-slate-700 cursor-pointer">
                    Mandatory Every Month (Special Mention)
                  </label>
                </div>
                <button onClick={addExpense} className="btn-primary col-span-2 flex items-center justify-center gap-2">
                  <Plus className="w-4 h-4" /> Add Expense
                </button>
              </div>

              <div className="overflow-x-auto mb-8 rounded-2xl border border-slate-100">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="table-header">Expense Name</th>
                      <th className="table-header">Amount</th>
                      <th className="table-header">Interest</th>
                      <th className="table-header">Mandatory</th>
                      <th className="table-header">Due Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {expenses.map((ex, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="table-cell font-medium">{ex.name}</td>
                        <td className="table-cell font-bold">₹{ex.amount}</td>
                        <td className="table-cell text-amber-600">{ex.interest}%</td>
                        <td className="table-cell">
                          {ex.isMandatory ? (
                            <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-[10px] font-bold uppercase">Yes</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase">No</span>
                          )}
                        </td>
                        <td className="table-cell">{ex.dueDate}</td>
                      </tr>
                    ))}
                    {expenses.length === 0 && (
                      <tr>
                        <td colSpan={5} className="table-cell text-center text-slate-400 py-8">No expenses added yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setStep(2)} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold">Back</button>
                <button onClick={onComplete} className="flex-[2] py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  Complete Setup <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<any, any> {
  state = { hasError: false };

  constructor(props: any) {
    super(props);
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    const that = this as any;
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
          <div className="glass-card p-8 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">Something went wrong</h2>
            <p className="text-slate-600 mb-6">The application encountered an unexpected error. Please try refreshing the page.</p>
            <button 
              onClick={() => window.location.reload()}
              className="btn-primary w-full"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return that.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [sector, setSector] = useState<string | null>(null);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleLogout = () => {
    setUser(null);
    setSector(null);
    setSetupComplete(false);
  };

  return (
    <ErrorBoundary>
      <div className="font-sans">
        <AnimatePresence mode="wait">
          {!user ? (
            <AuthScreen onLogin={setUser} />
          ) : !sector ? (
            <SectorSelection onSelect={setSector} />
          ) : !setupComplete ? (
            <SetupWizard sector={sector} onComplete={() => setSetupComplete(true)} />
          ) : (
            <Dashboard user={user} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}
