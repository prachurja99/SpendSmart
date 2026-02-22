import { useState, useEffect } from 'react'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { PlusCircle, Save, Sparkles } from 'lucide-react'

const CATEGORIES = ['Food', 'Transport', 'Shopping', 'Health', 'Entertainment', 'Education', 'Bills', 'Other']

const ExpenseForm = ({ onSuccess, editingExpense, onClose }) => {
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    note: '',
  })
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: editingExpense.amount,
        category: editingExpense.category,
        date: new Date(editingExpense.date).toISOString().split('T')[0],
        note: editingExpense.note || '',
      })
    }
  }, [editingExpense])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAISuggest = async () => {
    if (!form.title.trim()) {
      toast.error('Please enter a title first')
      return
    }
    setAiLoading(true)
    try {
      const { data } = await api.post('/ai/suggest-category', { title: form.title })
      setForm({ ...form, category: data.category })
      toast.success(`AI suggested: ${data.category}`)
    } catch (error) {
      toast.error('AI suggestion failed')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingExpense) {
        await api.put(`/expenses/${editingExpense._id}`, form)
        toast.success('Expense updated!')
      } else {
        await api.post('/expenses', form)
        toast.success('Expense added!')
      }
      onSuccess()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.card}>
      <h3 style={styles.title}>
        {editingExpense ? 'Edit Expense' : 'Add New Expense'}
      </h3>

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.grid}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Title</label>
            <div style={styles.titleRow}>
              <input
                type="text"
                name="title"
                placeholder="e.g. Lunch at restaurant"
                value={form.title}
                onChange={handleChange}
                required
                style={styles.input}
              />
              <button
                type="button"
                onClick={handleAISuggest}
                disabled={aiLoading}
                style={styles.aiBtn}
                title="AI Suggest Category"
              >
                <Sparkles size={16} />
                {aiLoading ? 'Thinking...' : 'AI'}
              </button>
            </div>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Amount (৳)</label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              value={form.amount}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              style={styles.input}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Category
              {form.category !== 'Other' && (
                <span style={styles.aiTag}>✨ AI</span>
              )}
            </label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              style={styles.input}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Note (optional)</label>
          <textarea
            name="note"
            placeholder="Any additional details..."
            value={form.note}
            onChange={handleChange}
            rows={2}
            style={{ ...styles.input, resize: 'none' }}
          />
        </div>

        <div style={styles.buttons}>
          <button type="submit" disabled={loading} style={styles.submitBtn}>
            {editingExpense ? <Save size={16} /> : <PlusCircle size={16} />}
            {loading ? 'Saving...' : editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  )
}

const styles = {
  card: {
    background: '#1e293b',
    borderRadius: '12px',
    padding: '24px',
    border: '1px solid #6366f1',
    boxShadow: '0 0 30px rgba(99,102,241,0.1)',
  },
  title: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#f1f5f9',
    marginBottom: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  aiTag: {
    fontSize: '11px',
    background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
    color: 'white',
    padding: '1px 6px',
    borderRadius: '4px',
    fontWeight: '600',
  },
  titleRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  input: {
    padding: '10px 14px',
    background: '#0f172a',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#f1f5f9',
    fontSize: '14px',
    outline: 'none',
    width: '100%',
  },
  aiBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    padding: '10px 14px',
    background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  submitBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 24px',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    boxShadow: '0 4px 15px rgba(99,102,241,0.3)',
  },
}

export default ExpenseForm