import { useState, useEffect, useRef } from 'react';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const fetchProducts = () => {
    setLoading(true);
    api.get('/products?limit=100&isActive=all')
      .then(res => setProducts(res.data.products))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Désactiver ce produit ?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Produit désactivé');
    fetchProducts();
  };

  if (showForm) {
    return (
      <ProductForm
        product={editProduct}
        onClose={() => { setShowForm(false); setEditProduct(null); }}
        onSaved={() => { fetchProducts(); setShowForm(false); setEditProduct(null); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-medium">Produits</h1>
        <button
          onClick={() => { setEditProduct(null); setShowForm(true); }}
          className="bg-charcoal text-cream text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-charcoal/90 transition-colors"
        >
          + Ajouter un produit
        </button>
      </div>

      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-xs text-gray-400 uppercase tracking-wider">
              {['Image', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Actions'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              Array(6).fill(0).map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-3"><div className="h-8 skeleton" /></td></tr>
              ))
            ) : products.map(product => (
              <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  {product.images?.[0]
                    ? <img src={product.images[0]} alt="" className="w-10 h-14 object-cover" loading="lazy" />
                    : <div className="w-10 h-14 bg-gray-200" />
                  }
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium max-w-[180px] truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.brand}</p>
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{product.category}</td>
                <td className="px-4 py-3 font-medium">{product.price} DT</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {product.sizes.map(s => (
                      <span key={s.size} className={`text-[10px] px-1.5 py-0.5 rounded-sm ${
                        s.stock === 0 ? 'bg-red-100 text-red-600' :
                        s.stock <= 5 ? 'bg-orange-100 text-orange-600' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {s.size}: {s.stock}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-sm ${
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.isActive ? 'Actif' : 'Inactif'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setEditProduct(product); setShowForm(true); }}
                      className="text-xs text-gold hover:underline"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Désactiver
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ProductForm({ product, onClose, onSaved }) {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState(product?.images || []);
  const [sizes, setSizes] = useState(product?.sizes || [{ size: 'M', stock: 10 }]);
  const [colors, setColors] = useState(product?.colors || [{ name: 'Noir', hex: '#1C1C1C' }]);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category || 'women',
    brand: product?.brand || 'DRAPE',
    tags: product?.tags?.join(', ') || '',
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive !== false
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    setPreviewUrls(files.map(f => URL.createObjectURL(f)));
  };

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    Object.entries(form).forEach(([k, v]) => formData.append(k, v));
    formData.set('sizes', JSON.stringify(sizes));
    formData.set('colors', JSON.stringify(colors));
    formData.set('tags', JSON.stringify(form.tags.split(',').map(t => t.trim()).filter(Boolean)));
    images.forEach(img => formData.append('images', img));

    try {
      if (isEdit) {
        await api.put(`/products/${product._id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Produit mis à jour');
      } else {
        await api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Produit créé');
      }
      onSaved();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const addSize = () => setSizes(prev => [...prev, { size: 'S', stock: 0 }]);
  const removeSize = (i) => setSizes(prev => prev.filter((_, idx) => idx !== i));
  const updateSize = (i, key, val) => setSizes(prev => prev.map((s, idx) => idx === i ? { ...s, [key]: val } : s));

  const addColor = () => setColors(prev => [...prev, { name: '', hex: '#000000' }]);
  const removeColor = (i) => setColors(prev => prev.filter((_, idx) => idx !== i));
  const updateColor = (i, key, val) => setColors(prev => prev.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-medium">
          {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
        </h1>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-gray-700">← Retour</button>
      </div>

      <form onSubmit={submit} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column */}
        <div className="space-y-5 bg-white border border-gray-100 p-6">
          <h3 className="font-medium text-sm">Informations générales</h3>

          <Field label="Nom du produit">
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              required className="admin-input" />
          </Field>

          <Field label="Description">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={4} required className="admin-input resize-none" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Prix (DT)">
              <input type="number" min="0" step="0.01" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                required className="admin-input" />
            </Field>
            <Field label="Catégorie">
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="admin-input">
                {['women', 'men', 'kids', 'accessories'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Marque">
              <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))}
                className="admin-input" />
            </Field>
            <Field label="Tags (virgule séparé)">
              <input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="robe, été, soie" className="admin-input" />
            </Field>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isFeatured}
                onChange={e => setForm(f => ({ ...f, isFeatured: e.target.checked }))}
                className="accent-gold" />
              Coup de cœur
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.isActive}
                onChange={e => setForm(f => ({ ...f, isActive: e.target.checked }))}
                className="accent-gold" />
              Produit actif
            </label>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Images */}
          <div className="bg-white border border-gray-100 p-6">
            <h3 className="font-medium text-sm mb-4">Images</h3>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 p-6 text-center cursor-pointer hover:border-gold transition-colors"
            >
              <p className="text-sm text-gray-400">Glisser-déposer ou cliquer pour sélectionner</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WEBP · Max 10MB</p>
            </div>
            <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />

            {previewUrls.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {previewUrls.map((url, i) => (
                  <div key={i} className="relative">
                    <img src={url} alt="" className="w-16 h-20 object-cover" loading="lazy" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrls(p => p.filter((_, idx) => idx !== i));
                        setImages(p => p.filter((_, idx) => idx !== i));
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-4 h-4 text-[10px] flex items-center justify-center"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Sizes */}
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm">Tailles & Stock</h3>
              <button type="button" onClick={addSize} className="text-xs text-gold hover:underline">+ Ajouter</button>
            </div>
            <div className="space-y-2">
              {sizes.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <select value={s.size} onChange={e => updateSize(i, 'size', e.target.value)}
                    className="admin-input flex-1">
                    {SIZES.map(sz => <option key={sz} value={sz}>{sz}</option>)}
                  </select>
                  <input type="number" min="0" value={s.stock}
                    onChange={e => updateSize(i, 'stock', Number(e.target.value))}
                    placeholder="Stock" className="admin-input w-24" />
                  <button type="button" onClick={() => removeSize(i)}
                    className="text-red-400 hover:text-red-600 px-1">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="bg-white border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-sm">Couleurs</h3>
              <button type="button" onClick={addColor} className="text-xs text-gold hover:underline">+ Ajouter</button>
            </div>
            <div className="space-y-2">
              {colors.map((c, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input type="color" value={c.hex}
                    onChange={e => updateColor(i, 'hex', e.target.value)}
                    className="w-10 h-9 cursor-pointer border-0" />
                  <input value={c.name} onChange={e => updateColor(i, 'name', e.target.value)}
                    placeholder="Nom (ex: Noir)" className="admin-input flex-1" />
                  <button type="button" onClick={() => removeColor(i)}
                    className="text-red-400 hover:text-red-600 px-1">✕</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="lg:col-span-2 flex gap-4">
          <button type="button" onClick={onClose} className="flex-1 border border-gray-200 py-3 text-sm hover:bg-gray-50">
            Annuler
          </button>
          <button type="submit" disabled={saving}
            className="flex-1 bg-charcoal text-cream py-3 text-sm tracking-wider hover:bg-charcoal/90 transition-colors disabled:opacity-50">
            {saving ? 'Enregistrement...' : isEdit ? 'Mettre à jour' : 'Créer le produit'}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs text-gray-500 mb-1">{label}</label>
      {children}
    </div>
  );
}
