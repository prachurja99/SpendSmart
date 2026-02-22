import { useState, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import ExpenseForm from '../components/expenses/ExpenseForm'
import ExpenseList from '../components/expenses/ExpenseList'
import SummaryCards from '../components/charts/SummaryCards'
import SpendingChart from '../components/charts/SpendingChart'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { Plus, X, ChevronLeft, ChevronRight } from 'lucide-react'

const MONTHS = [
  'January', 'February', 'March', 'April',
  'May', 'June', 'July', 'August',
  'September', 'October', 'November', 'December'
]

const Dashboard = () => {
  const now = new Date()
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [expenses, setExpenses] = useState([])
  const [summary, setSummary] = useState({ total: 0, byCategory: {}, count: 0 })
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/expenses', {
        params: { month: selectedMonth, year: selectedYear }
      })
      setExpenses(data)
    } catch (error) {
      toast.error('Failed to fetch expenses')
    }
  }

  const fetchSummary = async () => {
    try {
      const { data } = await api.get('/expenses/summary', {
        params: { month: selectedMonth, year: selectedYear }
      })
      setSummary(data)
    } catch (error) {
      toast.error('Failed to fetch summary')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLoading(true)
    fetchExpenses()
    fetchSummary()
  }, [selectedMonth, selectedYear])

  const handleExpenseAdded = () => {
    fetchExpenses()
    fetchSummary()
    setShowForm(false)
    setEditingExpense(null)
  }

  const handleEdit = (expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`)
      toast.success('Expense deleted')
      fetchExpenses()
      fetchSummary()
    } catch (error) {
      toast.error('Failed to delete expense')
    }
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingExpense(null)
  }

  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Track and manage your expenses</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addBtn}
          >
            {showForm ? <X size={18} /> : <Plus size={18} />}
            {showForm ? 'Cancel' : 'Add Expense'}
          </button>
        </div>

        <div style={styles.monthFilter}>
          <button onClick={handlePrevMonth} style={styles.arrowBtn}>
            <ChevronLeft size={20} />
          </button>
          <div style={styles.monthDisplay}>
            <span style={styles.monthText}>
              {MONTHS[selectedMonth - 1]} {selectedYear}
            </span>
          </div>
          <button onClick={handleNextMonth} style={styles.arrowBtn}>
            <ChevronRight size={20} />
          </button>
        </div>

        {loading ? (
          <div style={styles.loading}>Loading your data...</div>
        ) : (
          <>
            <SummaryCards summary={summary} />

            {showForm && (
              <div style={styles.formWrapper}>
                <ExpenseForm
                  onSuccess={handleExpenseAdded}
                  editingExpense={editingExpense}
                  onClose={handleCloseForm}
                />
              </div>
            )}

            <SpendingChart summary={summary} />

            <ExpenseList
              expenses={expenses}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0f172a',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px 24px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: '4px',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '14px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 20px',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
  },
  monthFilter: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '24px',
    background: '#1e293b',
    padding: '10px 16px',
    borderRadius: '12px',
    border: '1px solid #334155',
    width: 'fit-content',
  },
  arrowBtn: {
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#94a3b8',
    padding: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  monthDisplay: {
    minWidth: '160px',
    textAlign: 'center',
  },
  monthText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
  },
  formWrapper: {
    marginBottom: '24px',
  },
  loading: {
    textAlign: 'center',
    color: '#94a3b8',
    padding: '60px',
    fontSize: '16px',
  },
}

export default Dashboard