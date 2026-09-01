import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Plus, 
  Trash2, 
  Calendar, 
  PieChart as PieChartIcon, 
  BarChart3, 
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { IncomeExpenseRecord, Language } from '../types';

interface IncomeExpenseSectionProps {
  records: IncomeExpenseRecord[];
  language: Language;
  onAddRecord: (rec: Omit<IncomeExpenseRecord, 'id' | 'createdAt'>) => void;
  onDeleteRecord: (id: string) => void;
}

export const IncomeExpenseSection: React.FC<IncomeExpenseSectionProps> = ({
  records,
  language,
  onAddRecord,
  onDeleteRecord
}) => {
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [type, setType] = useState<'income' | 'expense'>('income');
  const [category, setCategory] = useState<string>('Printing & Xerox');
  const [amount, setAmount] = useState<number>(100);
  const [description, setDescription] = useState<string>('');
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const todayStr = new Date().toISOString().slice(0, 10);

  // Financial Metrics
  const totalIncome = records
    .filter((r) => r.type === 'income')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpense = records
    .filter((r) => r.type === 'expense')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const netProfit = totalIncome - totalExpense;

  const todayIncome = records
    .filter((r) => r.type === 'income' && r.date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

  const todayExpense = records
    .filter((r) => r.type === 'expense' && r.date === todayStr)
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Chart Data: Last 7 Days aggregation
  const chartDataMap: Record<string, { date: string; income: number; expense: number }> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dStr = d.toISOString().slice(5, 10); // MM-DD
    const fullDate = d.toISOString().slice(0, 10);
    chartDataMap[fullDate] = { date: dStr, income: 0, expense: 0 };
  }

  records.forEach((r) => {
    if (chartDataMap[r.date]) {
      if (r.type === 'income') chartDataMap[r.date].income += r.amount;
      else chartDataMap[r.date].expense += r.amount;
    }
  });

  const barChartData = Object.values(chartDataMap);

  // Category Pie Data for Incomes
  const categoryCounts: Record<string, number> = {};
  records
    .filter((r) => r.type === 'income')
    .forEach((r) => {
      categoryCounts[r.category] = (categoryCounts[r.category] || 0) + r.amount;
    });

  const pieChartData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value
  }));

  const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

  const handleSaveRecord = (e: React.FormEvent) => {
    e.preventDefault();
    onAddRecord({
      type,
      category,
      amount: Number(amount) || 0,
      description: description.trim() || category,
      date: new Date().toISOString().slice(0, 10),
      paymentMode
    });

    setDescription('');
    setAmount(100);
    setShowAddModal(false);
  };

  const filteredRecords = records.filter((r) => {
    if (filterType === 'all') return true;
    return r.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Balance Cards */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {language === 'bn' ? 'সাইবার ক্যাফে আয়-ব্যয় ও লাভ-ক্ষতি হিসাব' : 'Cyber Café Income & Expense Ledger'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn'
                ? 'দৈনিক ও মাসিক আয়-ব্যয়ের স্বচ্ছ হিসাব, গ্রাফ এবং সরাসরি এন্ট্রি সিস্টেম।'
                : 'Track daily cash collection, paper/ink expenses, and net profit with live visual analytics.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'bn' ? '+ আয় / ব্যয় যুক্ত করুন' : '+ Add Transaction'}</span>
          </button>
        </div>

        {/* Financial Stat Tiles */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">{language === 'bn' ? 'আজকের মোট আয়' : "Today's Income"}</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-600 font-mono mt-1">₹{todayIncome}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">{language === 'bn' ? 'সর্বমোট আয়' : 'Total Gross Income'}</span>
            <div className="text-lg sm:text-xl font-extrabold text-blue-600 font-mono mt-1">₹{totalIncome}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-[11px] font-semibold text-slate-500">{language === 'bn' ? 'সর্বমোট খরচ (Expense)' : 'Total Expenses'}</span>
            <div className="text-lg sm:text-xl font-extrabold text-rose-600 font-mono mt-1">₹{totalExpense}</div>
          </div>
          <div className="bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">{language === 'bn' ? 'মোট নেট লাভ (Net Profit)' : 'Total Net Profit'}</span>
            <div className="text-lg sm:text-xl font-extrabold text-emerald-700 dark:text-emerald-400 font-mono mt-1">₹{netProfit}</div>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bar Chart: Last 7 Days Income vs Expense */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            {language === 'bn' ? 'গত ৭ দিনের আয় ও ব্যয় বিশ্লেষণ' : 'Daily Income vs Expense Trend (Last 7 Days)'}
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="income" fill="#3b82f6" name="Income (₹)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" fill="#f43f5e" name="Expense (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Income by category */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
            <PieChartIcon className="w-4 h-4 text-indigo-600" />
            {language === 'bn' ? 'আয়ের উৎস অনুপাত' : 'Income by Service Category'}
          </h3>

          {pieChartData.length > 0 ? (
            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieChartData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-xs">No income data yet</div>
          )}

          <div className="grid grid-cols-2 gap-1 text-[10px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
            {pieChartData.slice(0, 4).map((p, idx) => (
              <div key={idx} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                <span className="truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Records Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {language === 'bn' ? 'লেনদেনের বিস্তারিত ইতিহাস' : 'Recent Transaction History'}
          </h3>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'income', 'expense'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                  filterType === t ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-2xs' : 'text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3">Payment Mode</th>
                <th className="py-2.5 px-3 text-right">Amount</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                  <td className="py-2.5 px-3 font-mono text-slate-500">{r.date}</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        r.type === 'income'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {r.type}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-medium text-slate-800 dark:text-slate-200">{r.category}</td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-400">{r.description}</td>
                  <td className="py-2.5 px-3 text-slate-500">{r.paymentMode || 'Cash'}</td>
                  <td className={`py-2.5 px-3 font-mono font-bold text-right ${r.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {r.type === 'income' ? '+' : '-'}₹{r.amount}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteRecord(r.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {language === 'bn' ? 'আয় বা ব্যয়ের হিসাব যুক্ত করুন' : 'Add Income or Expense'}
            </h3>
            <form onSubmit={handleSaveRecord} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setType('income')}
                  className={`py-2 rounded-xl font-bold border transition ${
                    type === 'income'
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  + Income (আয়)
                </button>
                <button
                  type="button"
                  onClick={() => setType('expense')}
                  className={`py-2 rounded-xl font-bold border transition ${
                    type === 'expense'
                      ? 'bg-rose-600 text-white border-rose-600'
                      : 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  - Expense (খরচ)
                </button>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-medium"
                >
                  {type === 'income' ? (
                    <>
                      <option value="Printing & Xerox">Printing & Xerox</option>
                      <option value="Online Form Fillup">Online Form Fillup</option>
                      <option value="Passport Photo">Passport Photo</option>
                      <option value="Lamination & Binding">Lamination & Binding</option>
                      <option value="Aadhaar / PVC Card">Aadhaar / PVC Card</option>
                      <option value="Money Transfer / AEPS">Money Transfer / AEPS</option>
                    </>
                  ) : (
                    <>
                      <option value="Paper & Ink Supplies">A4 Paper & Printer Ink Supplies</option>
                      <option value="Electricity & Internet Bill">Electricity & Internet Bill</option>
                      <option value="Shop Rent">Shop Rent</option>
                      <option value="Tea & Refreshment">Tea & Snacks</option>
                      <option value="Machine Maintenance">Machine Repair & Maintenance</option>
                    </>
                  )}
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Amount (₹) *</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono text-sm"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Payment Mode</label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as 'Cash' | 'UPI' | 'Card')}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI / PhonePe / GPay</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Description / Notes</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="py-2.5 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2.5 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
