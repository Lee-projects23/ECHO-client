import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Download, Eye, FileText, Share2, Check } from 'lucide-react';
import { DocumentItem } from '../../types/echo';

export const DocumentsView: React.FC = () => {
  const { documents } = useEcho();
  const [filterType, setFilterType] = useState<string>('All');
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const docTypes = ['All', 'Quotation', 'Invoice', 'Bill', 'Agreement', 'Report', 'Receipt'];

  const filteredDocs = documents.filter(d => {
    if (filterType !== 'All' && d.type !== filterType) return false;
    return true;
  });

  const handleShare = (doc: DocumentItem) => {
    setCopiedId(doc.id);
    navigator.clipboard?.writeText?.(`https://echo.workspace/docs/${doc.id}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDownload = (doc: DocumentItem) => {
    alert(`Downloading ${doc.title} (${doc.fileSize})...`);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800">
        <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
          Digital Document Vault
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
          Documents
        </h1>
        <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
          Official quotations, invoices, service level agreements, audit reports, and payment receipts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 my-8 pb-4 border-b border-stone-200/60 dark:border-stone-800/60">
        <span className="text-xs font-mono uppercase tracking-widest text-stone-500 mr-2">
          Category:
        </span>
        {docTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer ${
              filterType === type
                ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950 font-medium'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-200/60 dark:hover:bg-stone-800/60'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Documents Grid / Table */}
      <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20">
        <table className="w-full text-left text-sm font-sans border-collapse">
          <thead>
            <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60 text-[11px] font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
              <th className="py-3.5 px-4 font-normal">Document Title</th>
              <th className="py-3.5 px-4 font-normal">Type</th>
              <th className="py-3.5 px-4 font-normal">Reference No.</th>
              <th className="py-3.5 px-4 font-normal">Issue Date</th>
              <th className="py-3.5 px-4 font-normal">File Size</th>
              <th className="py-3.5 px-4 font-normal text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-200 dark:divide-stone-800">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs font-mono text-stone-500">
                  No documents found in this category.
                </td>
              </tr>
            ) : (
              filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-stone-100/50 dark:hover:bg-stone-800/40 transition-colors group">
                  <td className="py-4 px-4 text-xs font-medium text-stone-900 dark:text-stone-100">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-stone-400 shrink-0" />
                      <span className="group-hover:underline">{doc.title}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-600 dark:text-stone-400">
                    <span className="border border-stone-300 dark:border-stone-700 px-1.5 py-0.5 text-[10px] uppercase">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-500">
                    {doc.referenceNo}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-500">
                    {doc.date}
                  </td>
                  <td className="py-4 px-4 text-xs font-mono text-stone-400">
                    {doc.fileSize}
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2 text-xs font-mono">
                      <button
                        onClick={() => setSelectedDocPreview(doc)}
                        className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 cursor-pointer"
                        title="View document"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 cursor-pointer"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleShare(doc)}
                        className="p-1.5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 cursor-pointer"
                        title="Copy share link"
                      >
                        {copiedId === doc.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Document View Preview Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div
            onClick={() => setSelectedDocPreview(null)}
            className="fixed inset-0 bg-stone-950/70 backdrop-blur-sm"
          />

          <div className="relative max-w-2xl w-full bg-[#FAF8F5] dark:bg-[#111111] border border-stone-300 dark:border-stone-800 p-8 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-stone-400">
                  Document Inspection
                </span>
                <h3 className="font-editorial text-2xl text-stone-900 dark:text-stone-100">
                  {selectedDocPreview.title}
                </h3>
              </div>
              <span className="text-xs font-mono border border-stone-300 dark:border-stone-700 px-2 py-0.5">
                {selectedDocPreview.type}
              </span>
            </div>

            <div className="my-6 p-6 border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-950/60 font-mono text-xs space-y-3">
              <div className="flex justify-between">
                <span className="text-stone-400">Reference:</span>
                <span className="text-stone-900 dark:text-stone-100 font-semibold">{selectedDocPreview.referenceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">Date Issued:</span>
                <span className="text-stone-900 dark:text-stone-100">{selectedDocPreview.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-400">File Specification:</span>
                <span className="text-stone-900 dark:text-stone-100">{selectedDocPreview.fileSize} (Cryptographically Sealed)</span>
              </div>
              <div className="pt-4 border-t border-stone-200 dark:border-stone-800 text-[11px] text-stone-500 font-sans leading-relaxed">
                This document is certified by ECHO System Security. Any alterations invalidate digital signatures. Retain for corporate compliance and financial tax records.
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-stone-200 dark:border-stone-800">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="text-xs font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedDocPreview);
                  setSelectedDocPreview(null);
                }}
                className="px-4 py-2 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 text-xs font-mono uppercase tracking-widest transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Certified Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
