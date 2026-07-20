import React, { useState } from 'react';
import { useSubscriptions } from '../context/SubscriptionContext';
import { SubscriptionCard } from '../components/ui/SubscriptionCard';
import { SearchBar } from '../components/ui/SearchBar';
import { Modal } from '../components/ui/Modal';
import { CATEGORIES } from '../utils/constants';
import { Plus, LayoutGrid, List, SlidersHorizontal, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function Subscriptions() {
  const { subscriptions, addSub, updateSub, deleteSub } = useSubscriptions();
  const navigate = useNavigate();

  // Search & Filter state
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modals state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [currentSub, setCurrentSub] = useState(null);

  // Form state for Edit
  const [editName, setEditName] = useState('');
  const [editCost, setEditCost] = useState(0);
  const [editCycle, setEditCycle] = useState('monthly');
  const [editCategory, setEditCategory] = useState('entertainment');
  const [editPayment, setEditPayment] = useState('Card');
  const [editRenewal, setEditRenewal] = useState('');
  const [editNotes, setEditNotes] = useState('');

  // Handle Edit Action
  const handleOpenEdit = (sub) => {
    setCurrentSub(sub);
    setEditName(sub.name);
    setEditCost(sub.cost);
    setEditCycle(sub.billingCycle);
    setEditCategory(sub.category);
    setEditPayment(sub.paymentMethod || 'Card');
    setEditRenewal(sub.nextRenewal || '');
    setEditNotes(sub.notes || '');
    setIsEditOpen(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editName || editCost <= 0) {
      toast.error("Please fill in valid name and cost.");
      return;
    }
    try {
      await updateSub(currentSub.id, {
        name: editName,
        cost: parseFloat(editCost),
        billingCycle: editCycle,
        category: editCategory,
        paymentMethod: editPayment,
        nextRenewal: editRenewal,
        notes: editNotes
      });
      toast.success(`${editName} tracker updated!`);
      setIsEditOpen(false);
    } catch (err) {
      toast.error("Failed to update subscription.");
    }
  };

  const handleStatusChange = async (subId, nextStatus) => {
    try {
      await updateSub(subId, { status: nextStatus });
      toast.success(`Subscription status updated to ${nextStatus}!`);
    } catch (err) {
      toast.error("Failed to toggle status.");
    }
  };

  // Handle Delete Action
  const handleOpenDelete = (id, name) => {
    setCurrentSub({ id, name });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteSub(currentSub.id, currentSub.name);
      toast.success(`${currentSub.name} tracker removed.`);
      setIsDeleteOpen(false);
    } catch (err) {
      toast.error("Failed to delete subscription.");
    }
  };

  // Filter & Sort Logic
  const filteredSubs = subscriptions
    .filter(sub => {
      const matchesSearch = sub.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = filterCategory === 'all' || sub.category === filterCategory;
      const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'cost') return b.cost - a.cost;
      if (sortBy === 'renewal') {
        if (!a.nextRenewal) return 1;
        if (!b.nextRenewal) return -1;
        return new Date(a.nextRenewal) - new Date(b.nextRenewal);
      }
      return 0;
    });

  return (
    <div className="flex flex-col gap-6 text-left select-none">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">My Subscriptions</h2>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed">
            Manage your catalog filters, pause trackers, or add integrations.
          </p>
        </div>
        
        <button
          onClick={() => navigate('/subscriptions/add')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-purple to-brand-cyan text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
        >
          <Plus size={14} /> Add New
        </button>
      </div>

      {/* Control Bar (Search, Filters, Sort) */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
        <SearchBar value={search} onChange={setSearch} />
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Category Filter */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3.5 py-2 rounded-xl glass border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-brand-purple/40"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3.5 py-2 rounded-xl glass border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-brand-purple/40"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3.5 py-2 rounded-xl glass border border-white/10 text-xs text-gray-300 focus:outline-none focus:border-brand-purple/40"
          >
            <option value="name">Sort by Name</option>
            <option value="cost">Sort by Cost</option>
            <option value="renewal">Sort by Renewal</option>
          </select>
        </div>
      </div>

      {/* Grid Display */}
      {filteredSubs.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubs.map((sub, idx) => (
            <SubscriptionCard
              key={sub.id}
              subscription={sub}
              onEdit={handleOpenEdit}
              onStatusChange={handleStatusChange}
              onDelete={handleOpenDelete}
              delay={idx * 0.05}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-gray-500 text-sm">
          No subscriptions matched your filters.
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Subscription">
        <form onSubmit={handleSaveEdit} className="flex flex-col gap-4 text-left">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">Subscription Name</label>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Price (Cost)</label>
              <input
                type="number"
                step="0.01"
                value={editCost}
                onChange={(e) => setEditCost(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Billing Cycle</label>
              <select
                value={editCycle}
                onChange={(e) => setEditCycle(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Category</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
              >
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-400 font-medium">Payment Method</label>
              <input
                type="text"
                placeholder="HDFC Card, UPI, etc."
                value={editPayment}
                onChange={(e) => setEditPayment(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">Next Renewal Date</label>
            <input
              type="date"
              value={editRenewal}
              onChange={(e) => setEditRenewal(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm focus:outline-none focus:border-brand-purple/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-gray-400 font-medium">Notes</label>
            <textarea
              placeholder="Add plan details, credentials links, or splits..."
              value={editNotes}
              onChange={(e) => setEditNotes(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl glass border border-white/10 text-white text-sm h-20 focus:outline-none focus:border-brand-purple/40 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
            <button
              type="button"
              onClick={() => setIsEditOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple/90 text-white text-xs font-semibold cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} title="Confirm Removal">
        <div className="flex flex-col gap-4 text-left">
          <div className="flex items-center gap-3 text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3.5 rounded-xl">
            <Trash2 size={20} className="flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Delete Tracker</p>
              <p className="text-xs text-rose-300 mt-0.5">This action cannot be undone. All history logs for this provider will remain, but the active card will be deleted.</p>
            </div>
          </div>
          
          <p className="text-sm text-gray-300 leading-relaxed">
            Are you sure you want to delete the subscription tracker for <strong className="text-white">{currentSub?.name}</strong>?
          </p>

          <div className="flex justify-end gap-3 mt-4 border-t border-white/5 pt-4">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDelete}
              className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-semibold cursor-pointer"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </Modal>

    </div>
  );
}
