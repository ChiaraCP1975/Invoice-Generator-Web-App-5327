import React, { useState, useEffect } from 'react';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './common/SafeIcon';

const { FiPrinter, FiFile, FiFileText, FiCalculator, FiCheckCircle, FiCreditCard } = FiIcons;

function App() {
  const [formData, setFormData] = useState({
    numeroNota: '',
    dataNota: new Date().toISOString().split('T')[0],
    annoRiferimento: new Date().getFullYear(),
    oggettoPrestazione: '',
    numeroOre: '',
    costoOrario: '',
    costoForfettario: '',
    contributo: 'non eccedente',
    nomeBanca: 'Crédit Agricole Carispezia S.p.A.',
    ibanPaese: 'IT',
    ibanCheck: '13',
    ibanCin: 'I',
    ibanAbi: '06230',
    ibanCab: '49431',
    ibanCc: ''
  });

  const [calculations, setCalculations] = useState({
    compensoPrestazione: 0,
    imponibileIrpef: 0,
    ritenuta: 0,
    nettoLiquidare: 0
  });

  useEffect(() => {
    calculateTotals();
  }, [formData.numeroOre, formData.costoOrario, formData.costoForfettario]);

  const calculateTotals = () => {
    const numeroOre = parseFloat(formData.numeroOre) || 0;
    const costoOrario = parseFloat(formData.costoOrario) || 0;
    const costoForfettario = parseFloat(formData.costoForfettario) || 0;

    const compensoPrestazione = numeroOre * costoOrario;
    const imponibileIrpef = compensoPrestazione + costoForfettario;
    const ritenuta = imponibileIrpef * 0.2;
    const nettoLiquidare = imponibileIrpef - ritenuta;

    setCalculations({
      compensoPrestazione,
      imponibileIrpef,
      ritenuta,
      nettoLiquidare
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '__/__/____';
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handlePrint = () => {
    const pdfTitle = `Nota_Prestazione_${formData.numeroNota}_${formatDate(formData.dataNota).replace(/\//g, '-')}`;
    const originalTitle = document.title;
    document.title = pdfTitle;
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }, 200);
  };

  const handleNew = () => {
    // Mantieni i dati bancari e IBAN quando si crea una nuova nota
    setFormData(prev => ({
      ...prev,
      numeroNota: '',
      dataNota: new Date().toISOString().split('T')[0],
      annoRiferimento: new Date().getFullYear(),
      oggettoPrestazione: '',
      numeroOre: '',
      costoOrario: '',
      costoForfettario: '',
      contributo: 'non eccedente'
      // Mantieni nomeBanca e tutti i campi IBAN
    }));
  };

  return (
    <div className="min-h-screen py-8 px-4 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Controls */}
          <div className="lg:w-1/3 no-print">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="bg-blue-800 text-white p-4 rounded-t-lg">
                <h2 className="text-xl font-bold">Generatore Nota di Prestazione</h2>
              </div>
              
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <SafeIcon icon={FiFileText} className="mr-2" />
                    Informazioni Generali
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numero Nota</label>
                    <input 
                      type="text" 
                      value={formData.numeroNota}
                      onChange={(e) => handleInputChange('numeroNota', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                    <input 
                      type="date" 
                      value={formData.dataNota}
                      onChange={(e) => handleInputChange('dataNota', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Anno di riferimento</label>
                    <input 
                      type="number" 
                      value={formData.annoRiferimento}
                      onChange={(e) => handleInputChange('annoRiferimento', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Oggetto della prestazione</label>
                    <textarea 
                      value={formData.oggettoPrestazione}
                      onChange={(e) => handleInputChange('oggettoPrestazione', e.target.value)}
                      rows="2" 
                      placeholder="Descrivi l'oggetto della prestazione"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <SafeIcon icon={FiCalculator} className="mr-2" />
                    Calcolo Compenso
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Numero Ore</label>
                    <input 
                      type="number" 
                      value={formData.numeroOre}
                      onChange={(e) => handleInputChange('numeroOre', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Costo Orario (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.costoOrario}
                      onChange={(e) => handleInputChange('costoOrario', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Costo Forfettario (€)</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.costoForfettario}
                      onChange={(e) => handleInputChange('costoForfettario', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <SafeIcon icon={FiCheckCircle} className="mr-2" />
                    Dichiarazione Redditi
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contributo previdenziale</label>
                    <div className="flex items-center space-x-4 mt-1">
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="nonEccedente" 
                          name="contributo" 
                          value="non eccedente"
                          checked={formData.contributo === 'non eccedente'}
                          onChange={(e) => handleInputChange('contributo', e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="nonEccedente" className="ml-2 text-sm text-gray-700">Non eccedente 5000€</label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          type="radio" 
                          id="eccedente" 
                          name="contributo" 
                          value="eccedente"
                          checked={formData.contributo === 'eccedente'}
                          onChange={(e) => handleInputChange('contributo', e.target.value)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="eccedente" className="ml-2 text-sm text-gray-700">Eccedente 5000€</label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <SafeIcon icon={FiCreditCard} className="mr-2" />
                    Dati Bancari
                  </h3>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Banca</label>
                    <input 
                      type="text" 
                      value={formData.nomeBanca}
                      onChange={(e) => handleInputChange('nomeBanca', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">IBAN</label>
                    <div className="grid grid-cols-6 gap-2">
                      <div>
                        <label className="block text-xs text-gray-500">Paese</label>
                        <input 
                          type="text" 
                          value={formData.ibanPaese}
                          onChange={(e) => handleInputChange('ibanPaese', e.target.value)}
                          maxLength="2"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">Check</label>
                        <input 
                          type="text" 
                          value={formData.ibanCheck}
                          onChange={(e) => handleInputChange('ibanCheck', e.target.value)}
                          maxLength="2"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">CIN</label>
                        <input 
                          type="text" 
                          value={formData.ibanCin}
                          onChange={(e) => handleInputChange('ibanCin', e.target.value)}
                          maxLength="1"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">ABI</label>
                        <input 
                          type="text" 
                          value={formData.ibanAbi}
                          onChange={(e) => handleInputChange('ibanAbi', e.target.value)}
                          maxLength="5"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">CAB</label>
                        <input 
                          type="text" 
                          value={formData.ibanCab}
                          onChange={(e) => handleInputChange('ibanCab', e.target.value)}
                          maxLength="5"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500">C/C</label>
                        <input 
                          type="text" 
                          value={formData.ibanCc}
                          onChange={(e) => handleInputChange('ibanCc', e.target.value)}
                          maxLength="12"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex flex-wrap gap-3">
                  <button 
                    onClick={handlePrint}
                    className="bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition-colors flex items-center font-semibold"
                  >
                    <SafeIcon icon={FiPrinter} className="mr-2" />
                    Stampa PDF
                  </button>
                  <button 
                    onClick={handleNew}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center font-semibold"
                  >
                    <SafeIcon icon={FiFile} className="mr-2" />
                    Nuovo
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Preview */}
          <div className="lg:w-2/3">
            <div className="bg-white mx-auto p-6 shadow-lg border border-gray-200 print-area" style={{ maxWidth: '210mm' }}>
              <div className="flex justify-between mb-6 pb-3 border-b-2 border-blue-800">
                <div>
                  <h1 className="text-xl font-bold text-blue-800 mb-4">NOTA DI PRESTAZIONE OCCASIONALE</h1>
                  <p className="font-semibold text-sm">N. {formData.numeroNota || '____'}</p>
                  <p className="font-semibold text-sm">Data: {formatDate(formData.dataNota)}</p>
                </div>
                <div className="w-20 h-20 border border-dashed border-gray-400 bg-blue-50 flex flex-col justify-center items-center text-xs text-center">
                  <p className="font-semibold">Marca da bollo</p>
                  <p className="font-semibold">2,00 €</p>
                </div>
              </div>
              
              <div className="flex justify-between mb-6">
                <div className="w-1/2 pr-3">
                  <h3 className="font-semibold mb-2 text-gray-700 text-sm">MITTENTE:</h3>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                    <p>Gianluigi Soro<br />
                    Via Aurelia 34/B/5<br />
                    17025 Loano (SV)<br />
                    Nato a Sassari il 27/04/1967<br /><br />
                    <span className="font-semibold">Codice Fiscale:</span> SROGLG67D27I452B</p>
                  </div>
                </div>
                <div className="w-1/2 pl-3">
                  <h3 className="font-semibold mb-2 text-gray-700 text-sm">DESTINATARIO:</h3>
                  <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                    <p>Spettabile<br />
                    <span className="font-semibold">Fondazione Scuola Interregionale<br />
                    di Polizia Locale</span><br />
                    Via Busani, 14<br />
                    41122 MODENA<br /><br />
                    <span className="font-semibold">P.IVA/C.F.:</span> 02658900366</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2 text-gray-700 text-sm">OGGETTO DELLA PRESTAZIONE:</h3>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-xs">
                  <p>{formData.oggettoPrestazione || '____'}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="text-left py-2 px-3 font-semibold border-b">Descrizione</th>
                      <th className="text-right py-2 px-3 font-semibold border-b">Importo (€)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3">Compenso per prestazione occasionale ({formData.numeroOre || 0} ore x {parseFloat(formData.costoOrario || 0).toFixed(2)} €/ora)</td>
                      <td className="text-right py-2 px-3">{calculations.compensoPrestazione.toFixed(2)} €</td>
                    </tr>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <td className="py-2 px-3">Costo forfettario</td>
                      <td className="text-right py-2 px-3">{parseFloat(formData.costoForfettario || 0).toFixed(2)} €</td>
                    </tr>
                    <tr className="border-b border-gray-200 font-semibold bg-gray-100">
                      <td className="py-2 px-3">Imponibile IRPEF</td>
                      <td className="text-right py-2 px-3">{calculations.imponibileIrpef.toFixed(2)} €</td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-3">Ritenuta d'acconto 20% su Imponibile IRPEF</td>
                      <td className="text-right py-2 px-3">- {calculations.ritenuta.toFixed(2)} €</td>
                    </tr>
                    <tr className="font-bold bg-gray-100">
                      <td className="py-2 px-3">Netto a liquidare</td>
                      <td className="text-right py-2 px-3">{calculations.nettoLiquidare.toFixed(2)} €</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mb-6 text-xs p-3 bg-gray-50 border border-gray-200 rounded">
                <p className="mb-3">Prestazione occasionale di cui all'art. 67, lett.L del D.P.R. 917/86 (redditi diversi).<br />
                Operazione professionale non soggetta ad I.V.A. per mancanza del presupposto soggettivo di cui all'art. 5 del DPR 633/72 e successive modifiche.</p>
                
                <p className="mb-2">Si autocertifica che in riferimento all'applicazione del contributo previdenziale 
                di cui all'art.2 comma 26, Legge 8 agosto 1995, n.335 ai sensi dell'art 44, comma 2, D.L. n. 269/2003, che per l'anno solare {formData.annoRiferimento || '____'}, alla data odierna, ho conseguito redditi derivanti dall'esercizio di attività di lavoro autonomo occasionale in misura:</p>
                
                <div className="flex items-center space-x-6 my-3 ml-3">
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-gray-400 mr-2 inline-block flex items-center justify-center">
                      {formData.contributo === 'non eccedente' ? '✓' : ''}
                    </div>
                    <span>non eccedente a 5000 euro lordi</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-4 h-4 border border-gray-400 mr-2 inline-block flex items-center justify-center">
                      {formData.contributo === 'eccedente' ? '✓' : ''}
                    </div>
                    <span>eccedente a 5000 euro lordi</span>
                  </div>
                </div>
              </div>
              
              <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded text-xs">
                <p>L'importo dovrà essere bonificato c/o la Banca:</p>
                <p className="font-semibold my-2">{formData.nomeBanca}</p>
                
                <div className="mt-3">
                  <table className="w-full border-collapse">
                    <tbody>
                      <tr>
                        <td className="font-semibold pr-2 text-xs">* IBAN :</td>
                        <td className="border border-gray-300 px-1 py-1 text-center font-mono font-semibold text-xs">{formData.ibanPaese}</td>
                        <td className="border border-gray-300 px-1 py-1 text-center font-mono font-semibold text-xs">{formData.ibanCheck}</td>
                        <td className="border border-gray-300 px-1 py-1 text-center font-mono font-semibold text-xs">{formData.ibanCin}</td>
                        <td className="border border-gray-300 px-1 py-1 text-center font-mono font-semibold text-xs">{formData.ibanAbi}</td>
                        <td className="border border-gray-300 px-1 py-1 text-center font-mono font-semibold text-xs">{formData.ibanCab}</td>
                        <td className="border border-gray-300 px-1 py-1 text-center font-mono font-semibold text-xs">{formData.ibanCc}</td>
                      </tr>
                      <tr>
                        <td></td>
                        <td className="text-center text-xs pt-1"></td>
                        <td className="text-center text-xs pt-1">Chk-digit</td>
                        <td className="text-center text-xs pt-1">CIN</td>
                        <td className="text-center text-xs pt-1">ABI</td>
                        <td className="text-center text-xs pt-1">CAB</td>
                        <td className="text-center text-xs pt-1">C/C</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="text-right mt-8">
                <p className="text-sm">In Fede</p>
                <div className="border-t border-gray-800 w-40 ml-auto mt-2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
            font-size: 11px !important;
            line-height: 1.3 !important;
          }
          
          .print-area {
            box-shadow: none !important;
            margin: 0 !important;
            padding: 15mm !important;
            max-width: 100% !important;
            width: 210mm !important;
            min-height: 297mm !important;
            border: none !important;
            page-break-inside: avoid !important;
          }
          
          .bg-gray-50, .bg-gray-100, .bg-blue-50 {
            background-color: #f7fafc !important;
          }
          
          .bg-gray-100 {
            background-color: #edf2f7 !important;
          }
          
          .bg-blue-50 {
            background-color: #ebf8ff !important;
          }
          
          .border-blue-800 {
            border-color: #2c5282 !important;
          }
          
          .text-blue-800 {
            color: #2c5282 !important;
          }
          
          table {
            border-collapse: collapse !important;
            width: 100% !important;
          }
          
          th, td {
            border: 1px solid #e2e8f0 !important;
            padding: 6px !important;
            font-size: 10px !important;
          }
          
          h1 {
            font-size: 16px !important;
            margin-bottom: 12px !important;
          }
          
          h3 {
            font-size: 12px !important;
            margin-bottom: 8px !important;
          }
          
          p {
            font-size: 10px !important;
            line-height: 1.3 !important;
            margin-bottom: 6px !important;
          }
          
          .print-area > div {
            margin-bottom: 12px !important;
          }
          
          .print-area > div:last-child {
            margin-bottom: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}

export default App;