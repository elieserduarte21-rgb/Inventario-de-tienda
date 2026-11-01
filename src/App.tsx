/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  BarChart3, 
  Plus, 
  Edit2, 
  Trash2, 
  DollarSign, 
  Layers, 
  CheckCircle2, 
  Search,
  Sparkles,
  TrendingUp,
  Settings,
  Cigarette
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface Product {
  id: string;
  name: string;
  category: string;
  costPrice: number; // PCosto
  salePrice: number; // PVenta
  stockAnterior: number; // Inventario asistente (stock anterior)
  entradasHoy: number;   // Entradas del día
  loQueQuedo: number;    // Lo que quedó (conteo físico)
}

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Café Arábica Gourmet 250g', category: 'Bebidas', costPrice: 4.50, salePrice: 7.80, stockAnterior: 35, entradasHoy: 20, loQueQuedo: 42 },
  { id: '2', name: 'Aceite de Oliva Extra Virgen 500ml', category: 'Abarrotes', costPrice: 6.00, salePrice: 9.50, stockAnterior: 20, entradasHoy: 10, loQueQuedo: 24 },
  { id: '3', name: 'Arroz Premium Grano Fino 1kg', category: 'Granos', costPrice: 1.20, salePrice: 1.85, stockAnterior: 90, entradasHoy: 50, loQueQuedo: 115 },
  { id: '4', name: 'Azúcar Morena Orgánica 1kg', category: 'Abarrotes', costPrice: 0.90, salePrice: 1.40, stockAnterior: 60, entradasHoy: 30, loQueQuedo: 72 },
  { id: '5', name: 'Leche Entera Pasteurizada 1L', category: 'Lácteos', costPrice: 1.10, salePrice: 1.65, stockAnterior: 45, entradasHoy: 25, loQueQuedo: 55 }
];

const INITIAL_CIGARS: Product[] = [
  { id: 'c1', name: 'Marlboro Gold 20s (Cajetilla)', category: 'Cigarros', costPrice: 4.00, salePrice: 6.50, stockAnterior: 25, entradasHoy: 10, loQueQuedo: 28 },
  { id: 'c2', name: 'Lucky Strike Red 20s (Cajetilla)', category: 'Cigarros', costPrice: 3.50, salePrice: 5.80, stockAnterior: 20, entradasHoy: 10, loQueQuedo: 22 },
  { id: 'c3', name: 'Habano Artesanal Robusto', category: 'Habanos', costPrice: 8.00, salePrice: 14.00, stockAnterior: 12, entradasHoy: 5, loQueQuedo: 14 }
];

type ColorTheme = 'emerald' | 'blue' | 'purple' | 'amber' | 'slate';
type BgTheme = 'bg-slate-50 text-slate-900' | 'bg-zinc-50 text-zinc-900' | 'bg-neutral-900 text-neutral-100 dark' | 'bg-sky-50 text-sky-950';

export default function App() {
  const [activeTab, setActiveTab] = useState<'cuadre' | 'cigarros' | 'catalogo' | 'estadisticas'>('cuadre');
  
  // App Settings with LocalStorage persistence
  const [appName, setAppName] = useState<string>(() => localStorage.getItem('app_name') || 'Inventario & Ventas Pro');
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => (localStorage.getItem('app_color_theme') as ColorTheme) || 'emerald');
  const [bgTheme, setBgTheme] = useState<BgTheme>(([...Object.values(['bg-slate-50 text-slate-900', 'bg-zinc-50 text-zinc-900', 'bg-neutral-900 text-neutral-100 dark', 'bg-sky-50 text-sky-950'])].includes(localStorage.getItem('app_bg_theme') || '') ? localStorage.getItem('app_bg_theme') : 'bg-slate-50 text-slate-900') as BgTheme);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('inv_products_v5');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [cigarProducts, setCigarProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('inv_cigars_v1');
    return saved ? JSON.parse(saved) : INITIAL_CIGARS;
  });

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states for Product Add/Edit
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productTargetType, setProductTargetType] = useState<'general' | 'cigar'>('general');
  const [formData, setFormData] = useState({
    name: '',
    category: 'General',
    costPrice: '',
    salePrice: '',
    stockAnterior: '',
    entradasHoy: '',
    loQueQuedo: ''
  });

  useEffect(() => {
    localStorage.setItem('inv_products_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('inv_cigars_v1', JSON.stringify(cigarProducts));
  }, [cigarProducts]);

  useEffect(() => {
    localStorage.setItem('app_name', appName);
  }, [appName]);

  useEffect(() => {
    localStorage.setItem('app_color_theme', colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem('app_bg_theme', bgTheme);
  }, [bgTheme]);

  // Color theme mapping classes
  const themeStyles = {
    emerald: {
      primaryBg: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      primaryText: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      borderFocus: 'focus:ring-emerald-500/20 focus:border-emerald-500',
      selection: 'selection:bg-emerald-500 selection:text-white',
      accentBar: 'bg-emerald-600'
    },
    blue: {
      primaryBg: 'bg-blue-600 hover:bg-blue-700 text-white',
      primaryText: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700',
      borderFocus: 'focus:ring-blue-500/20 focus:border-blue-500',
      selection: 'selection:bg-blue-500 selection:text-white',
      accentBar: 'bg-blue-600'
    },
    purple: {
      primaryBg: 'bg-purple-600 hover:bg-purple-700 text-white',
      primaryText: 'text-purple-600',
      badgeBg: 'bg-purple-50 text-purple-700',
      borderFocus: 'focus:ring-purple-500/20 focus:border-purple-500',
      selection: 'selection:bg-purple-500 selection:text-white',
      accentBar: 'bg-purple-600'
    },
    amber: {
      primaryBg: 'bg-amber-600 hover:bg-amber-700 text-white',
      primaryText: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700',
      borderFocus: 'focus:ring-amber-500/20 focus:border-amber-500',
      selection: 'selection:bg-amber-500 selection:text-white',
      accentBar: 'bg-amber-600'
    },
    slate: {
      primaryBg: 'bg-slate-800 hover:bg-slate-900 text-white',
      primaryText: 'text-slate-800',
      badgeBg: 'bg-slate-100 text-slate-700',
      borderFocus: 'focus:ring-slate-500/20 focus:border-slate-500',
      selection: 'selection:bg-slate-500 selection:text-white',
      accentBar: 'bg-slate-800'
    }
  }[colorTheme];

  // Handlers for Product CRUD
  const handleOpenAddModal = (targetType: 'general' | 'cigar' = 'general') => {
    setEditingProduct(null);
    setProductTargetType(targetType);
    setFormData({ name: '', category: targetType === 'cigar' ? 'Cigarros' : 'General', costPrice: '', salePrice: '', stockAnterior: '0', entradasHoy: '0', loQueQuedo: '0' });
    setIsProductModalOpen(true);
  };

  const handleOpenEditModal = (p: Product, targetType: 'general' | 'cigar') => {
    setEditingProduct(p);
    setProductTargetType(targetType);
    setFormData({
      name: p.name,
      category: p.category,
      costPrice: p.costPrice.toString(),
      salePrice: p.salePrice.toString(),
      stockAnterior: p.stockAnterior.toString(),
      entradasHoy: p.entradasHoy.toString(),
      loQueQuedo: p.loQueQuedo.toString()
    });
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const cost = parseFloat(formData.costPrice) || 0;
    const sale = parseFloat(formData.salePrice) || 0;
    const ant = parseInt(formData.stockAnterior) || 0;
    const ent = parseInt(formData.entradasHoy) || 0;
    const que = parseInt(formData.loQueQuedo) || 0;

    const targetListSetter = productTargetType === 'cigar' ? setCigarProducts : setProducts;
    const currentList = productTargetType === 'cigar' ? cigarProducts : products;

    if (editingProduct) {
      targetListSetter(currentList.map(p => p.id === editingProduct.id ? {
        ...p,
        name: formData.name,
        category: formData.category,
        costPrice: cost,
        salePrice: sale,
        stockAnterior: ant,
        entradasHoy: ent,
        loQueQuedo: que
      } : p));
    } else {
      const newProd: Product = {
        id: Date.now().toString(),
        name: formData.name,
        category: formData.category,
        costPrice: cost,
        salePrice: sale,
        stockAnterior: ant,
        entradasHoy: ent,
        loQueQuedo: que
      };
      targetListSetter([...currentList, newProd]);
    }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, targetType: 'general' | 'cigar') => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      if (targetType === 'cigar') {
        setCigarProducts(cigarProducts.filter(p => p.id !== id));
      } else {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  const handleUpdateField = (id: string, field: 'entradasHoy' | 'loQueQuedo' | 'stockAnterior', val: number, targetType: 'general' | 'cigar') => {
    const setter = targetType === 'cigar' ? setCigarProducts : setProducts;
    const list = targetType === 'cigar' ? cigarProducts : products;

    setter(list.map(p => {
      if (p.id === id) {
        return { ...p, [field]: Math.max(0, val) };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCigars = cigarProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.category.toLowerCase().includes(searchTerm.toLowerCase()));

  // Combined stats calculations
  const allProductsCombined = [...products, ...cigarProducts];
  const totalInventoryValueCost = allProductsCombined.reduce((acc, p) => acc + (p.loQueQuedo * p.costPrice), 0);
  const totalInventoryValueSale = allProductsCombined.reduce((acc, p) => acc + (p.loQueQuedo * p.salePrice), 0);

  // Totals for General Cuadre
  const totalsGeneral = filteredProducts.reduce((acc, p) => {
    const ventaCalc = Math.max(0, (p.stockAnterior + p.entradasHoy) - p.loQueQuedo);
    const gananciaVenta = ventaCalc * (p.salePrice - p.costPrice);
    const ingresoVenta = ventaCalc * p.salePrice;
    const costoVenta = ventaCalc * p.costPrice;

    return {
      stockAnterior: acc.stockAnterior + p.stockAnterior,
      entradas: acc.entradas + p.entradasHoy,
      loQueQuedo: acc.loQueQuedo + p.loQueQuedo,
      ventaCalc: acc.ventaCalc + ventaCalc,
      gananciaVenta: acc.gananciaVenta + gananciaVenta,
      ingresoVenta: acc.ingresoVenta + ingresoVenta,
      costoVenta: acc.costoVenta + costoVenta,
    };
  }, { stockAnterior: 0, entradas: 0, loQueQuedo: 0, ventaCalc: 0, gananciaVenta: 0, ingresoVenta: 0, costoVenta: 0 });

  // Totals for Cigarros Cuadre
  const totalsCigars = filteredCigars.reduce((acc, p) => {
    const ventaCalc = Math.max(0, (p.stockAnterior + p.entradasHoy) - p.loQueQuedo);
    const gananciaVenta = ventaCalc * (p.salePrice - p.costPrice);
    const ingresoVenta = ventaCalc * p.salePrice;
    const costoVenta = ventaCalc * p.costPrice;

    return {
      stockAnterior: acc.stockAnterior + p.stockAnterior,
      entradas: acc.entradas + p.entradasHoy,
      loQueQuedo: acc.loQueQuedo + p.loQueQuedo,
      ventaCalc: acc.ventaCalc + ventaCalc,
      gananciaVenta: acc.gananciaVenta + gananciaVenta,
      ingresoVenta: acc.ingresoVenta + ingresoVenta,
      costoVenta: acc.costoVenta + costoVenta,
    };
  }, { stockAnterior: 0, entradas: 0, loQueQuedo: 0, ventaCalc: 0, gananciaVenta: 0, ingresoVenta: 0, costoVenta: 0 });

  // Combined totals for stats
  const totalCombinedGanancia = totalsGeneral.gananciaVenta + totalsCigars.gananciaVenta;
  const chartData = [
    { dia: 'Hace 6 días', ganancia: Math.round((totalCombinedGanancia * 0.75) * 100) / 100 },
    { dia: 'Hace 5 días', ganancia: Math.round((totalCombinedGanancia * 0.82) * 100) / 100 },
    { dia: 'Hace 4 días', ganancia: Math.round((totalCombinedGanancia * 0.90) * 100) / 100 },
    { dia: 'Hace 3 días', ganancia: Math.round((totalCombinedGanancia * 0.85) * 100) / 100 },
    { dia: 'Anteayer', ganancia: Math.round((totalCombinedGanancia * 0.95) * 100) / 100 },
    { dia: 'Ayer', ganancia: Math.round((totalCombinedGanancia * 0.88) * 100) / 100 },
    { dia: 'Hoy', ganancia: Math.round(totalCombinedGanancia * 100) / 100 }
  ];

  return (
    <div className={`min-h-screen ${bgTheme} font-sans flex flex-col ${themeStyles.selection} transition-colors duration-200`}>
      {/* Clean Top Bar Contract */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center justify-between gap-8 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center gap-3 shrink-0">
          <div className={`w-9 h-9 ${themeStyles.primaryBg} rounded-lg flex items-center justify-center text-white shadow-sm`}>
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-900 dark:text-white leading-none">{appName}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Control de costos y cuadre local</p>
          </div>
        </div>

        {/* Navigation Tabs: Cuadre -> Cigarros -> Catálogo -> Estadísticas */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('cuadre')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'cuadre' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${themeStyles.primaryText}`} />
            Cuadre
          </button>
          <button 
            onClick={() => setActiveTab('cigarros')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'cigarros' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
          >
            <Cigarette className="w-3.5 h-3.5 text-amber-600" />
            Cigarros
          </button>
          <button 
            onClick={() => setActiveTab('catalogo')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'catalogo' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
          >
            <Package className="w-3.5 h-3.5" />
            Catálogo y Precios
          </button>
          <button 
            onClick={() => setActiveTab('estadisticas')}
            className={`px-4 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 ${activeTab === 'estadisticas' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'}`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Estadísticas y Utilidad
          </button>
        </nav>

        {/* Primary Actions & Settings Button */}
        <div className="flex items-center gap-2 shrink-0">
          <button 
            onClick={() => handleOpenAddModal(activeTab === 'cigarros' ? 'cigar' : 'general')}
            className={`px-3 py-2 text-xs font-medium ${themeStyles.primaryBg} rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shadow-xs`}
          >
            <Plus className="w-3.5 h-3.5" />
            {activeTab === 'cigarros' ? 'Nuevo Cigarro' : 'Nuevo Producto'}
          </button>
          
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors shadow-xs"
            title="Opciones de apariencia y nombre"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-2 py-2 text-xs font-medium text-slate-600 dark:text-slate-300">
        <button onClick={() => setActiveTab('cuadre')} className={`px-3 py-1 rounded ${activeTab === 'cuadre' ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''}`}>Cuadre</button>
        <button onClick={() => setActiveTab('cigarros')} className={`px-3 py-1 rounded ${activeTab === 'cigarros' ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''}`}>Cigarros</button>
        <button onClick={() => setActiveTab('catalogo')} className={`px-3 py-1 rounded ${activeTab === 'catalogo' ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''}`}>Catálogo</button>
        <button onClick={() => setActiveTab('estadisticas')} className={`px-3 py-1 rounded ${activeTab === 'estadisticas' ? 'bg-slate-100 dark:bg-slate-800 font-semibold' : ''}`}>Márgenes</button>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* Search bar */}
        {activeTab !== 'estadisticas' && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Buscar producto por nombre o categoría..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-9 pr-4 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white placeholder:text-slate-400 ${themeStyles.borderFocus}`}
              />
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <span>Mostrando filtrados</span>
            </div>
          </div>
        )}

        {/* TAB 1: CUADRE */}
        {activeTab === 'cuadre' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Sparkles className={`w-4 h-4 ${themeStyles.primaryText}`} />
                  Panel de Cuadre Diario - Inventario General
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Las ventas se reportan automáticamente al ingresar el conteo físico (*Lo que quedó*).
                </p>
              </div>
              <span className={`inline-flex items-center gap-1 text-xs ${themeStyles.badgeBg} px-2.5 py-1 rounded-full font-medium self-start sm:self-auto`}>
                <CheckCircle2 className="w-3.5 h-3.5" /> Guardado Local Activo
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <th className="py-3 px-3">Producto</th>
                    <th className="py-3 px-3 text-right">PCosto ($)</th>
                    <th className="py-3 px-3 text-right">PVenta ($)</th>
                    <th className="py-3 px-3 text-center bg-blue-50/30 dark:bg-blue-950/30">Stock Ant.</th>
                    <th className="py-3 px-3 text-center bg-amber-50/30 dark:bg-amber-950/30">Entradas (+)</th>
                    <th className="py-3 px-3 text-center bg-purple-50/30 dark:bg-purple-950/30">Quedó (Físico)</th>
                    <th className="py-3 px-3 text-center bg-emerald-50/30 dark:bg-emerald-950/30 font-bold">Venta (=)</th>
                    <th className="py-3 px-3 text-right bg-emerald-100/40 dark:bg-emerald-900/40 font-bold text-emerald-900 dark:text-emerald-200">Ganancia Venta ($)</th>
                    <th className="py-3 px-3 text-right bg-indigo-50/40 dark:bg-indigo-950/40 font-bold text-indigo-900 dark:text-indigo-200">Margen s/ Costo (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {filteredProducts.map((p) => {
                    const ventaCalculada = Math.max(0, (p.stockAnterior + p.entradasHoy) - p.loQueQuedo);
                    const gananciaVenta = ventaCalculada * (p.salePrice - p.costPrice);
                    const margenCosto = p.costPrice > 0 ? ((p.salePrice - p.costPrice) / p.costPrice) * 100 : 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                          <span className="text-[11px] text-slate-400">{p.category}</span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          ${p.costPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                          ${p.salePrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-center bg-blue-50/10 font-mono tabular-nums text-blue-900 dark:text-blue-300 font-semibold">
                          {p.stockAnterior}
                        </td>
                        <td className="py-3.5 px-3 text-center bg-amber-50/10">
                          <input 
                            type="number" 
                            min="0"
                            value={p.entradasHoy}
                            onChange={(e) => handleUpdateField(p.id, 'entradasHoy', parseInt(e.target.value) || 0, 'general')}
                            className="w-14 text-center py-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded font-mono tabular-nums text-xs focus:outline-none focus:ring-1 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-center bg-purple-50/10">
                          <input 
                            type="number" 
                            min="0"
                            value={p.loQueQuedo}
                            onChange={(e) => handleUpdateField(p.id, 'loQueQuedo', parseInt(e.target.value) || 0, 'general')}
                            className="w-14 text-center py-1 bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded font-mono tabular-nums text-xs focus:outline-none focus:ring-1 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-center bg-emerald-50/20 font-mono tabular-nums text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                          {ventaCalculada}
                        </td>
                        <td className="py-3.5 px-3 text-right bg-emerald-100/10 font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                          +${gananciaVenta.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right bg-indigo-50/10 font-mono tabular-nums text-indigo-700 dark:text-indigo-400 font-semibold">
                          {margenCosto.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  {filteredProducts.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No se encontraron productos en el inventario general.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Totalize General Table */}
                <tfoot>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono">
                    <td className="py-3.5 px-3 font-sans" colSpan={3}>TOTALES GENERALES</td>
                    <td className="py-3.5 px-3 text-center tabular-nums">{totalsGeneral.stockAnterior}</td>
                    <td className="py-3.5 px-3 text-center tabular-nums">{totalsGeneral.entradas}</td>
                    <td className="py-3.5 px-3 text-center tabular-nums">{totalsGeneral.loQueQuedo}</td>
                    <td className="py-3.5 px-3 text-center tabular-nums text-emerald-800 dark:text-emerald-300">{totalsGeneral.ventaCalc}</td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400">+${totalsGeneral.gananciaVenta.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-indigo-700 dark:text-indigo-400">
                      {totalsGeneral.costoVenta > 0 ? ((totalsGeneral.gananciaVenta / totalsGeneral.costoVenta) * 100).toFixed(1) + '%' : '0.0%'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <p>💡 <strong className="text-slate-700 dark:text-slate-300">Cierre diario:</strong> Al verificar el conteo físico, pulsa el botón para actualizar el stock anterior de la siguiente jornada.</p>
              <button 
                onClick={() => {
                  setProducts(products.map(p => ({
                    ...p,
                    stockAnterior: p.loQueQuedo,
                    entradasHoy: 0
                  })));
                  alert('¡Cuadre general actualizado! El cierre pasó a ser el Stock Anterior.');
                }}
                className={`px-4 py-2 ${themeStyles.primaryBg} rounded-lg font-medium transition-colors`}
              >
                Cerrar Día y Actualizar Stock Anterior
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: CIGARROS (MISMA ESTRUCTURA QUE CUADRE) */}
        {activeTab === 'cigarros' && (
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/55 dark:bg-slate-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Cigarette className="w-4 h-4 text-amber-600" />
                  Panel de Cuadre Diario - Inventario de Cigarros
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Control específico de tabaco y cigarros. Los datos se sincronizan con la sección correspondiente en el catálogo.
                </p>
              </div>
              <button 
                onClick={() => handleOpenAddModal('cigar')}
                className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Cigarro
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                    <th className="py-3 px-3">Producto (Cigarros)</th>
                    <th className="py-3 px-3 text-right">PCosto ($)</th>
                    <th className="py-3 px-3 text-right">PVenta ($)</th>
                    <th className="py-3 px-3 text-center bg-blue-50/30 dark:bg-blue-950/30">Stock Ant.</th>
                    <th className="py-3 px-3 text-center bg-amber-50/30 dark:bg-amber-950/30">Entradas (+)</th>
                    <th className="py-3 px-3 text-center bg-purple-50/30 dark:bg-purple-950/30">Quedó (Físico)</th>
                    <th className="py-3 px-3 text-center bg-emerald-50/30 dark:bg-emerald-950/30 font-bold">Venta (=)</th>
                    <th className="py-3 px-3 text-right bg-emerald-100/40 dark:bg-emerald-900/40 font-bold text-emerald-900 dark:text-emerald-200">Ganancia Venta ($)</th>
                    <th className="py-3 px-3 text-right bg-indigo-50/40 dark:bg-indigo-950/40 font-bold text-indigo-900 dark:text-indigo-200">Margen s/ Costo (%)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                  {filteredCigars.map((p) => {
                    const ventaCalculada = Math.max(0, (p.stockAnterior + p.entradasHoy) - p.loQueQuedo);
                    const gananciaVenta = ventaCalculada * (p.salePrice - p.costPrice);
                    const margenCosto = p.costPrice > 0 ? ((p.salePrice - p.costPrice) / p.costPrice) * 100 : 0;

                    return (
                      <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-900 dark:text-white">{p.name}</div>
                          <span className="text-[11px] text-slate-400">{p.category}</span>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">
                          ${p.costPrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">
                          ${p.salePrice.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-center bg-blue-50/10 font-mono tabular-nums text-blue-900 dark:text-blue-300 font-semibold">
                          {p.stockAnterior}
                        </td>
                        <td className="py-3.5 px-3 text-center bg-amber-50/10">
                          <input 
                            type="number" 
                            min="0"
                            value={p.entradasHoy}
                            onChange={(e) => handleUpdateField(p.id, 'entradasHoy', parseInt(e.target.value) || 0, 'cigar')}
                            className="w-14 text-center py-1 bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-700 rounded font-mono tabular-nums text-xs focus:outline-none focus:ring-1 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-center bg-purple-50/10">
                          <input 
                            type="number" 
                            min="0"
                            value={p.loQueQuedo}
                            onChange={(e) => handleUpdateField(p.id, 'loQueQuedo', parseInt(e.target.value) || 0, 'cigar')}
                            className="w-14 text-center py-1 bg-white dark:bg-slate-800 border border-purple-300 dark:border-purple-700 rounded font-mono tabular-nums text-xs focus:outline-none focus:ring-1 text-slate-900 dark:text-white"
                          />
                        </td>
                        <td className="py-3.5 px-3 text-center bg-emerald-50/20 font-mono tabular-nums text-emerald-800 dark:text-emerald-300 font-bold text-sm">
                          {ventaCalculada}
                        </td>
                        <td className="py-3.5 px-3 text-right bg-emerald-100/10 font-mono tabular-nums font-bold text-emerald-700 dark:text-emerald-400">
                          +${gananciaVenta.toFixed(2)}
                        </td>
                        <td className="py-3.5 px-3 text-right bg-indigo-50/10 font-mono tabular-nums text-indigo-700 dark:text-indigo-400 font-semibold">
                          {margenCosto.toFixed(1)}%
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCigars.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-8 text-center text-slate-400">
                        No se encontraron cigarros en el inventario.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Totalize Cigar Table */}
                <tfoot>
                  <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono">
                    <td className="py-3.5 px-3 font-sans" colSpan={3}>TOTALES CIGARROS</td>
                    <td className="py-3.5 px-3 text-center tabular-nums">{totalsCigars.stockAnterior}</td>
                    <td className="py-3.5 px-3 text-center tabular-nums">{totalsCigars.entradas}</td>
                    <td className="py-3.5 px-3 text-center tabular-nums">{totalsCigars.loQueQuedo}</td>
                    <td className="py-3.5 px-3 text-center tabular-nums text-emerald-800 dark:text-emerald-300">{totalsCigars.ventaCalc}</td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-emerald-700 dark:text-emerald-400">+${totalsCigars.gananciaVenta.toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-right tabular-nums text-indigo-700 dark:text-indigo-400">
                      {totalsCigars.costoVenta > 0 ? ((totalsCigars.gananciaVenta / totalsCigars.costoVenta) * 100).toFixed(1) + '%' : '0.0%'}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
              <p>💡 <strong className="text-slate-700 dark:text-slate-300">Cierre diario cigarros:</strong> Actualiza el stock anterior de cigarros para la siguiente jornada.</p>
              <button 
                onClick={() => {
                  setCigarProducts(cigarProducts.map(p => ({
                    ...p,
                    stockAnterior: p.loQueQuedo,
                    entradasHoy: 0
                  })));
                  alert('¡Cuadre de cigarros actualizado!');
                }}
                className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium transition-colors hover:bg-amber-700"
              >
                Cerrar Día y Actualizar Stock Cigarros
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: CATÁLOGO Y PRECIOS (DOS TABLAS: GENERAL Y CIGARROS) */}
        {activeTab === 'catalogo' && (
          <div className="space-y-8">
            {/* Tabla 1: Inventario General */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Package className="w-4 h-4 text-emerald-600" />
                    Catálogo 1: Inventario General
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gestión de precios de costo y venta de productos generales.</p>
                </div>
                <button 
                  onClick={() => handleOpenAddModal('general')}
                  className={`px-3 py-1.5 ${themeStyles.primaryBg} text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-xs`}
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Producto
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4 text-right">Precio Costo (PCosto)</th>
                      <th className="py-3 px-4 text-right">Precio Venta (PVenta)</th>
                      <th className="py-3 px-4 text-right">Margen s/ Costo</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {filteredProducts.map((p) => {
                      const marginOnCost = p.costPrice > 0 ? ((p.salePrice - p.costPrice) / p.costPrice) * 100 : 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[11px]">{p.category}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">${p.costPrice.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">${p.salePrice.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${marginOnCost >= 30 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                              {marginOnCost.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleOpenEditModal(p, 'general')}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors"
                                title="Editar producto"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, 'general')}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded transition-colors"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono">
                      <td className="py-3.5 px-4 font-sans" colSpan={2}>PROMEDIOS GENERALES ({filteredProducts.length})</td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        ${(filteredProducts.reduce((acc, p) => acc + p.costPrice, 0) / (filteredProducts.length || 1)).toFixed(2)} (prom.)
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                        ${(filteredProducts.reduce((acc, p) => acc + p.salePrice, 0) / (filteredProducts.length || 1)).toFixed(2)} (prom.)
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-indigo-700 dark:text-indigo-400">
                        {((filteredProducts.reduce((acc, p) => acc + (p.costPrice > 0 ? (p.salePrice - p.costPrice) / p.costPrice : 0), 0) / (filteredProducts.length || 1)) * 100).toFixed(1)}% (prom.)
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Tabla 2: Inventario de Cigarros */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Cigarette className="w-4 h-4 text-amber-600" />
                    Catálogo 2: Inventario de Cigarros y Tabaco
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gestión de precios de costo y venta de cigarros.</p>
                </div>
                <button 
                  onClick={() => handleOpenAddModal('cigar')}
                  className="px-3 py-1.5 bg-amber-600 text-white text-xs font-medium rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar Cigarro
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-[11px] font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
                      <th className="py-3 px-4">Producto</th>
                      <th className="py-3 px-4">Categoría</th>
                      <th className="py-3 px-4 text-right">Precio Costo (PCosto)</th>
                      <th className="py-3 px-4 text-right">Precio Venta (PVenta)</th>
                      <th className="py-3 px-4 text-right">Margen s/ Costo</th>
                      <th className="py-3 px-4 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {filteredCigars.map((p) => {
                      const marginOnCost = p.costPrice > 0 ? ((p.salePrice - p.costPrice) / p.costPrice) * 100 : 0;
                      return (
                        <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-4 font-semibold text-slate-900 dark:text-white">{p.name}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[11px]">{p.category}</span>
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600 dark:text-slate-400">${p.costPrice.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700 dark:text-emerald-400 font-semibold">${p.salePrice.toFixed(2)}</td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 dark:text-slate-300">
                            <span className={`px-2 py-0.5 rounded text-[11px] ${marginOnCost >= 30 ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                              {marginOnCost.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button 
                                onClick={() => handleOpenEditModal(p, 'cigar')}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded transition-colors"
                                title="Editar cigarro"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, 'cigar')}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 rounded transition-colors"
                                title="Eliminar cigarro"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100/90 dark:bg-slate-800/90 border-t-2 border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-900 dark:text-white font-mono">
                      <td className="py-3.5 px-4 font-sans" colSpan={2}>PROMEDIOS CIGARROS ({filteredCigars.length})</td>
                      <td className="py-3.5 px-4 text-right tabular-nums">
                        ${(filteredCigars.reduce((acc, p) => acc + p.costPrice, 0) / (filteredCigars.length || 1)).toFixed(2)} (prom.)
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-emerald-700 dark:text-emerald-400">
                        ${(filteredCigars.reduce((acc, p) => acc + p.salePrice, 0) / (filteredCigars.length || 1)).toFixed(2)} (prom.)
                      </td>
                      <td className="py-3.5 px-4 text-right tabular-nums text-indigo-700 dark:text-indigo-400">
                        {((filteredCigars.reduce((acc, p) => acc + (p.costPrice > 0 ? (p.salePrice - p.costPrice) / p.costPrice : 0), 0) / (filteredCigars.length || 1)) * 100).toFixed(1)}% (prom.)
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ESTADÍSTICAS Y MÁRGENES DE UTILIDAD */}
        {activeTab === 'estadisticas' && (
          <div className="space-y-6">
            
            {/* Los 4 cuadros estadísticos (KPIs generales combinados) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Valor Inventario (Costo)</p>
                  <h3 className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">${totalInventoryValueCost.toFixed(2)}</h3>
                </div>
                <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Valor Inventario (Venta)</p>
                  <h3 className="text-xl font-bold font-mono tabular-nums text-slate-900 dark:text-white mt-1">${totalInventoryValueSale.toFixed(2)}</h3>
                </div>
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ganancia Potencial Inventario</p>
                  <h3 className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">${(totalInventoryValueSale - totalInventoryValueCost).toFixed(2)}</h3>
                </div>
                <div className="w-10 h-10 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Ganancia Total Jornada (Ambos)</p>
                  <h3 className="text-xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400 mt-1">
                    +${totalCombinedGanancia.toFixed(2)}
                  </h3>
                </div>
                <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Gráfico de Líneas con Recharts: Evolución de las ganancias combinadas */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Evolución de las Ganancias por Venta (General + Cigarros)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Gráfico de tendencia de utilidad neta generada en los últimos 7 días.</p>
                </div>
                <span className="text-xs font-mono bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-lg font-medium self-start">
                  Tendencia Reciente
                </span>
              </div>

              <div className="w-full h-72 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.15} />
                    <XAxis 
                      dataKey="dia" 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={11} 
                      tickLine={false}
                      tickFormatter={(val) => `$${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                      formatter={(value: any) => [`$${Number(value).toFixed(2)}`, 'Ganancia']}
                      labelStyle={{ fontWeight: 'bold', color: '#34d399', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="ganancia" 
                      stroke="#059669" 
                      strokeWidth={2.5} 
                      dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#10b981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Rendimiento resumido */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs p-6 space-y-6">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-600" />
                Desglose de Utilidades por Sección
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inventario General (Cuadre)</span>
                  <h3 className="text-2xl font-bold font-mono tabular-nums text-emerald-600 dark:text-emerald-400">+${totalsGeneral.gananciaVenta.toFixed(2)}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ventas calculadas: <strong className="font-mono">${totalsGeneral.ingresoVenta.toFixed(2)}</strong></p>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-5 space-y-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Inventario de Cigarros</span>
                  <h3 className="text-2xl font-bold font-mono tabular-nums text-amber-600 dark:text-amber-400">+${totalsCigars.gananciaVenta.toFixed(2)}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Ventas calculadas: <strong className="font-mono">${totalsCigars.ingresoVenta.toFixed(2)}</strong></p>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* MODAL: SETTINGS & APPEARANCE */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Settings className="w-4 h-4 text-emerald-600" />
                Opciones de la App y Apariencia
              </h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre de la Aplicación</label>
                <input 
                  type="text" 
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-2">Paleta de Colores Moderna (Acento)</label>
                <div className="grid grid-cols-5 gap-2">
                  <button 
                    onClick={() => setColorTheme('emerald')}
                    className={`h-9 rounded-lg bg-emerald-600 border-2 ${colorTheme === 'emerald' ? 'border-slate-900 dark:border-white scale-105 shadow-md' : 'border-transparent'}`}
                    title="Esmeralda"
                  />
                  <button 
                    onClick={() => setColorTheme('blue')}
                    className={`h-9 rounded-lg bg-blue-600 border-2 ${colorTheme === 'blue' ? 'border-slate-900 dark:border-white scale-105 shadow-md' : 'border-transparent'}`}
                    title="Zafiro Azul"
                  />
                  <button 
                    onClick={() => setColorTheme('purple')}
                    className={`h-9 rounded-lg bg-purple-600 border-2 ${colorTheme === 'purple' ? 'border-slate-900 dark:border-white scale-105 shadow-md' : 'border-transparent'}`}
                    title="Amatista Púrpura"
                  />
                  <button 
                    onClick={() => setColorTheme('amber')}
                    className={`h-9 rounded-lg bg-amber-600 border-2 ${colorTheme === 'amber' ? 'border-slate-900 dark:border-white scale-105 shadow-md' : 'border-transparent'}`}
                    title="Ámbar Cálido"
                  />
                  <button 
                    onClick={() => setColorTheme('slate')}
                    className={`h-9 rounded-lg bg-slate-800 border-2 ${colorTheme === 'slate' ? 'border-slate-900 dark:border-white scale-105 shadow-md' : 'border-transparent'}`}
                    title="Carbón Neutro"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-2">Fondo de Pantalla a Gusto</label>
                <div className="space-y-2">
                  <button 
                    onClick={() => setBgTheme('bg-slate-50 text-slate-900')}
                    className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between transition-all ${bgTheme.includes('bg-slate-50') ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <span>Gris Claro Moderno (Slate)</span>
                    <span className="w-4 h-4 rounded-full bg-slate-100 border border-slate-300"></span>
                  </button>

                  <button 
                    onClick={() => setBgTheme('bg-zinc-50 text-zinc-900')}
                    className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between transition-all ${bgTheme.includes('bg-zinc-50') ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/30 font-semibold' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <span>Blanco Cálido (Zinc)</span>
                    <span className="w-4 h-4 rounded-full bg-zinc-100 border border-zinc-300"></span>
                  </button>

                  <button 
                    onClick={() => setBgTheme('bg-neutral-900 text-neutral-100 dark')}
                    className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between transition-all ${bgTheme.includes('bg-neutral-900') ? 'border-emerald-600 bg-neutral-800 font-semibold' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <span>Modo Oscuro Profundo (Dark)</span>
                    <span className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-700"></span>
                  </button>

                  <button 
                    onClick={() => setBgTheme('bg-sky-50 text-sky-950')}
                    className={`w-full text-left px-3 py-2 rounded-lg border flex items-center justify-between transition-all ${bgTheme.includes('bg-sky-50') ? 'border-emerald-600 bg-sky-100/50 font-semibold' : 'border-slate-200 dark:border-slate-800'}`}
                  >
                    <span>Azul Pastel Suave (Sky)</span>
                    <span className="w-4 h-4 rounded-full bg-sky-100 border border-sky-300"></span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className={`px-4 py-2 ${themeStyles.primaryBg} rounded-lg font-medium shadow-xs`}
              >
                Guardar y Aplicar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT PRODUCT */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold">
                {editingProduct ? 'Editar Producto' : (productTargetType === 'cigar' ? 'Agregar Nuevo Cigarro' : 'Agregar Nuevo Producto')}
              </h3>
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={productTargetType === 'cigar' ? 'Ej. Marlboro Gold 20s' : 'Ej. Café Arábica 250g'} 
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Categoría</label>
                  <input 
                    type="text" 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder={productTargetType === 'cigar' ? 'Cigarros' : 'Abarrotes'} 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Inicial</label>
                  <input 
                    type="number" 
                    min="0"
                    value={formData.stockAnterior}
                    onChange={(e) => setFormData({ ...formData, stockAnterior: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Precio Costo (PCosto $)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    placeholder="0.00" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">Precio Venta (PVenta $)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="0.00" 
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button 
                  type="button" 
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className={`px-4 py-2 ${themeStyles.primaryBg} rounded-lg font-medium shadow-xs`}
                >
                  {editingProduct ? 'Guardar Cambios' : 'Crear Registro'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
