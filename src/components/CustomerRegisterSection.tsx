import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Download, 
  DollarSign, 
  Phone, 
  Calendar,
  UserCheck
} from 'lucide-react';
import { CustomerRecord, Language } from '../types';

interface CustomerRegisterSectionProps {
  customers: CustomerRecord[];
  language: Language;
  onAddCustomer: (cust: Omit<CustomerRecord, 'id' | 'createdAt'>) => void;
  onUpdateStatus: (id: string, status: 'Paid' | 'Due') => void;
  onDeleteCustomer: (id: string) => void;
}

export const CustomerRegisterSection: React.FC<CustomerRegisterSectionProps> = ({
  customers,
  language,
  onAddCustomer,
  onUpdateStatus,
  onDeleteCustomer
}) => {
  const [search, setSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Paid' | 'Due'>('all');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Customer Form State
  const [name, setName] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [service, setService] = useState<string>('');
  const [amount, setAmount] = useState<number>(50);
  const [paymentStatus, setPaymentStatus] = useState<'Paid' | 'Due'>('Paid');
  const [notes, setNotes] = useState<string>('');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.mobile.includes(search) ||
      c.serviceTaken.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return c.paymentStatus === statusFilter;
  });

  const totalDueAmount = customers
    .filter((c) => c.paymentStatus === 'Due')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPaidAmount = customers
    .filter((c) => c.paymentStatus === 'Paid')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !service.trim()) {
      alert('Please fill customer name and service taken.');
      return;
    }

    onAddCustomer({
      customerName: name.trim(),
      mobile: mobile.trim() || 'N/A',
      serviceTaken: service.trim(),
      amount: Number(amount) || 0,
      paymentStatus,
      printCount: 0,
      scanCount: 0,
      notes: notes.trim(),
      date: new Date().toISOString().slice(0, 10)
    });

    setName('');
    setMobile('');
    setService('');
    setAmount(50);
    setPaymentStatus('Paid');
    setNotes('');
    setShowAddModal(false);
  };

  const handleSendWhatsAppReminder = (c: CustomerRecord) => {
    if (!c.mobile || c.mobile === 'N/A') {
      alert('No valid mobile number for this customer.');
      return;
    }
    const cleanMobile = c.mobile.replace(/\D/g, '');
    const mobileNumber = cleanMobile.length === 10 ? '91' + cleanMobile : cleanMobile;
    const text = encodeURIComponent(
      `Hello ${c.customerName},\nThis is a friendly reminder from Digital Seva Cyber Café regarding your service "${c.serviceTaken}".\nPending Due Amount: ₹${c.amount}.\nPlease clear at your convenience. Thank you!`
    );
    window.open(`https://wa.me/${mobileNumber}?text=${text}`, '_blank');
  };

  const exportToCsv = () => {
    const headers = ['Customer Name,Mobile,Service Taken,Amount,Status,Date,Notes'];
    const rows = customers.map(
      (c) => `"${c.customerName}","${c.mobile}","${c.serviceTaken}",${c.amount},"${c.paymentStatus}","${c.date}","${c.notes || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `customer_khata_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats Banner */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              {language === 'bn' ? 'সাইবার ক্যাফে কাস্টমার রেজিস্টার ও খাতা' : 'Cyber Café Customer Khata & Register'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              {language === 'bn'
                ? 'দৈনিক গ্রাহকের সেবা, পাওনা টাকা (Due), পরিশোধিত হিসাব ও হোয়াটসঅ্যাপ রিমাইন্ডার পাঠানোর সহজ খাতা।'
                : 'Manage customer service records, track dues and payments, and send instant WhatsApp reminders.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={exportToCsv}
              className="py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'bn' ? '+ নতুন গ্রাহক এন্ট্রি' : '+ Add Customer'}</span>
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <span className="text-xs font-medium text-slate-500">{language === 'bn' ? 'মোট গ্রাহক রেকর্ড' : 'Total Customers'}</span>
            <div className="text-xl font-bold text-slate-900 dark:text-white font-mono mt-1">{customers.length}</div>
          </div>
          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200/60 dark:border-emerald-800/50">
            <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">{language === 'bn' ? 'পরিশোধিত মোট আয় (Paid)' : 'Total Paid Collection'}</span>
            <div className="text-xl font-bold text-emerald-700 dark:text-emerald-400 font-mono mt-1">₹{totalPaidAmount}</div>
          </div>
          <div className="bg-rose-50/60 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-200/60 dark:border-rose-800/50">
            <span className="text-xs font-medium text-rose-700 dark:text-rose-300">{language === 'bn' ? 'বাকি বা পাওনা টাকা (Due)' : 'Total Due Outstanding'}</span>
            <div className="text-xl font-bold text-rose-700 dark:text-rose-400 font-mono mt-1">₹{totalDueAmount}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'নাম, মোবাইল বা সেবা দিয়ে খুঁজুন...' : 'Search by name, mobile, or service...'}
            className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 w-full sm:w-auto">
          {(['all', 'Paid', 'Due'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === st
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {st === 'all' ? (language === 'bn' ? 'সব' : 'All') : st}
            </button>
          ))}
        </div>
      </div>

      {/* Customers Table / Card List */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'তারিখ' : 'Date'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'গ্রাহকের নাম ও মোবাইল' : 'Customer Name & Mobile'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'গৃহীত সেবা' : 'Service Taken'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'টাকার পরিমাণ' : 'Amount'}</th>
                <th className="py-3 px-4 font-semibold">{language === 'bn' ? 'স্ট্যাটাস' : 'Status'}</th>
                <th className="py-3 px-4 font-semibold text-right">{language === 'bn' ? 'অ্যাকশন' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    {language === 'bn' ? 'কোনো গ্রাহকের রেকর্ড পাওয়া যায়নি।' : 'No customer records found.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 text-slate-500 font-mono whitespace-nowrap">{cust.date}</td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{cust.customerName}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3" />
                        {cust.mobile}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-700 dark:text-slate-300 font-medium">{cust.serviceTaken}</div>
                      {cust.notes && <div className="text-[10px] text-slate-400">{cust.notes}</div>}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      ₹{cust.amount}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => onUpdateStatus(cust.id, cust.paymentStatus === 'Paid' ? 'Due' : 'Paid')}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition ${
                          cust.paymentStatus === 'Paid'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                        }`}
                        title="Click to toggle Paid / Due"
                      >
                        {cust.paymentStatus === 'Paid' ? <CheckCircle2 className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                        <span>{cust.paymentStatus}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      {cust.paymentStatus === 'Due' && cust.mobile && cust.mobile !== 'N/A' && (
                        <button
                          type="button"
                          onClick={() => handleSendWhatsAppReminder(cust)}
                          className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950 rounded-lg transition"
                          title="Send WhatsApp Reminder"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onDeleteCustomer(cust.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950 rounded-lg transition"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              {language === 'bn' ? 'নতুন গ্রাহক সেবা এন্ট্রি' : 'Add New Customer Record'}
            </h3>
            <form onSubmit={handleSaveCustomer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'গ্রাহকের নাম' : 'Customer Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Subir Das"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর' : 'Mobile Number'}
                </label>
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="e.g. 9832112233"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'গৃহীত সেবা' : 'Service Taken'} *
                </label>
                <input
                  type="text"
                  required
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  placeholder="e.g. Banglarbhumi Khatian Print, SSC MTS Form Fillup"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'bn' ? 'টাকার পরিমাণ (₹)' : 'Amount (₹)'}
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1">
                    {language === 'bn' ? 'পেমেন্ট স্ট্যাটাস' : 'Payment Status'}
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as 'Paid' | 'Due')}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 outline-none font-bold"
                  >
                    <option value="Paid">Paid (পরিশোধ)</option>
                    <option value="Due">Due (বাকি)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">
                  {language === 'bn' ? 'নোট / রেজিস্ট্রেশন আইডি' : 'Notes / App ID (Optional)'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. App ID: WB123456"
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
