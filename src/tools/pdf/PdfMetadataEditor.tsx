import React, { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Download, Save, FileText } from 'lucide-react';

export function PdfMetadataEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pdfDoc, setPdfDoc] = useState<PDFDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);

  const [meta, setMeta] = useState({
    title: '',
    author: '',
    subject: '',
    creator: '',
    producer: '',
    keywords: ''
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    setIsProcessing(true);
    setDownloadUrl(null);

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const doc = await PDFDocument.load(arrayBuffer);
      setPdfDoc(doc);

      setMeta({
        title: doc.getTitle() || '',
        author: doc.getAuthor() || '',
        subject: doc.getSubject() || '',
        creator: doc.getCreator() || '',
        producer: doc.getProducer() || '',
        keywords: doc.getKeywords() || ''
      });
    } catch (err) {
      console.error(err);
      alert('Could not parse PDF. It might be encrypted.');
      setFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const saveMetadata = async () => {
    if (!pdfDoc || !file) return;
    setIsProcessing(true);

    try {
      pdfDoc.setTitle(meta.title);
      pdfDoc.setAuthor(meta.author);
      pdfDoc.setSubject(meta.subject);
      pdfDoc.setCreator(meta.creator);
      pdfDoc.setProducer(meta.producer);
      pdfDoc.setKeywords(meta.keywords.split(',').map(k => k.trim()));

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
    } catch (err) {
      console.error(err);
      alert('Error saving metadata.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 text-slate-800 dark:text-slate-200">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-sm mb-6">
        <strong>Privacy First:</strong> Your PDF doesn't leave your computer. Metadata editing is done entirely in your browser using <code>pdf-lib</code>.
      </div>

      {!file ? (
        <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-2xl h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
          <input type="file" accept="application/pdf" className="hidden" onChange={handleFileUpload} />
          <Upload className="w-12 h-12 text-indigo-500 mb-4" />
          <span className="font-bold text-lg">Select PDF File</span>
          <span className="text-sm text-slate-500 mt-1">Works entirely offline</span>
        </label>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm text-center flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-red-500 mb-4" />
            <h3 className="font-bold w-full truncate mb-1" title={file.name}>{file.name}</h3>
            <span className="text-xs text-slate-500 mb-6 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            
            <button 
              onClick={() => { setFile(null); setPdfDoc(null); setDownloadUrl(null); }}
              className="text-sm text-slate-500 hover:text-red-500 transition-colors font-bold"
            >
              Cancel / Select Another
            </button>
          </div>

          <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
             <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
               <SettingsIcon className="w-5 h-5 text-indigo-500" /> Document Properties
             </h3>

             {isProcessing ? (
               <div className="flex justify-center items-center h-48 text-indigo-500 font-bold gap-2">
                 <div className="animate-spin w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
                 Processing PDF...
               </div>
             ) : (
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                     <input type="text" value={meta.title} onChange={e => setMeta({...meta, title: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Author</label>
                     <input type="text" value={meta.author} onChange={e => setMeta({...meta, author: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Subject</label>
                   <input type="text" value={meta.subject} onChange={e => setMeta({...meta, subject: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                   <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Creator</label>
                     <input type="text" value={meta.creator} onChange={e => setMeta({...meta, creator: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Producer</label>
                     <input type="text" value={meta.producer} onChange={e => setMeta({...meta, producer: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Keywords</label>
                   <input type="text" placeholder="Comma separated keywords" value={meta.keywords} onChange={e => setMeta({...meta, keywords: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded focus:ring-2 focus:ring-indigo-500 focus:outline-none" />
                 </div>

                 <div className="pt-4 flex gap-4">
                   {downloadUrl ? (
                     <a href={downloadUrl} download={`meta_${file.name}`} className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded transition-colors">
                       <Download className="w-5 h-5" /> Download Modified PDF
                     </a>
                   ) : (
                     <button onClick={saveMetadata} className="flex-1 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded transition-colors">
                       <Save className="w-5 h-5" /> Apply Metadata Changes
                     </button>
                   )}
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}

const SettingsIcon = (props: any) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path><circle cx="12" cy="12" r="3"></circle></svg>
);
