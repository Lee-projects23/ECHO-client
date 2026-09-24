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
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome />

      {/* Header */}
      <div className="border-b border-line pb-8">
        <span className="section-kicker">Digital Document Vault</span>
        <h1 className="h-display mt-1">Documents</h1>
        <p className="mt-1 text-sm text-tint">
          Official quotations, invoices, service level agreements, audit reports, and payment receipts.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mt-8 flex flex-wrap items-center gap-1.5 pb-4">
        <span className="label-overline mr-2">Category</span>
        {docTypes.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
              filterType === type
                ? 'border-ink bg-ink text-ctafg'
                : 'border-line text-tint hover:border-linestrong hover:text-ink'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-3xl border border-line bg-raise">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-tray text-[10px] font-semibold uppercase tracking-[0.16em] text-faint">
              <th className="px-5 py-3.5 font-normal">Document Title</th>
              <th className="px-5 py-3.5 font-normal">Type</th>
              <th className="px-5 py-3.5 font-normal">Reference No.</th>
              <th className="px-5 py-3.5 font-normal">Issue Date</th>
              <th className="px-5 py-3.5 font-normal">File Size</th>
              <th className="px-5 py-3.5 text-right font-normal">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredDocs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-xs text-faint">
                  No documents found in this category.
                </td>
              </tr>
            ) : (
              filteredDocs.map(doc => (
                <tr key={doc.id} className="group transition-colors hover:bg-tray">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <FileText className="h-4 w-4" strokeWidth={1.75} />
                      </div>
                      <span className="text-xs font-medium text-ink">{doc.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-tint">
                      {doc.type}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-mono-numbers text-xs text-tint">{doc.referenceNo}</td>
                  <td className="px-5 py-4 font-mono-numbers text-xs text-tint">{doc.date}</td>
                  <td className="px-5 py-4 font-mono-numbers text-xs text-faint">{doc.fileSize}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedDocPreview(doc)}
                        className="icon-btn"
                        title="View document"
                      >
                        <Eye className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        className="icon-btn"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </button>
                      <button
                        onClick={() => handleShare(doc)}
                        className="icon-btn"
                        title="Copy share link"
                      >
                        {copiedId === doc.id ? (
                          <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.75} />
                        ) : (
                          <Share2 className="h-3.5 w-3.5" strokeWidth={1.75} />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4">
          <div
            onClick={() => setSelectedDocPreview(null)}
            className="anim-fade fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="card-surface anim-pop relative w-full max-w-2xl p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div>
                <span className="label-overline">Document Inspection</span>
                <h3 className="mt-0.5 text-2xl font-medium tracking-[-0.02em] text-ink">{selectedDocPreview.title}</h3>
              </div>
              <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-faint">
                {selectedDocPreview.type}
              </span>
            </div>

            <div className="my-6 space-y-3 rounded-2xl bg-tray p-6 text-xs">
              <div className="flex justify-between">
                <span className="label-overline">Reference</span>
                <span className="font-mono-numbers font-semibold text-ink">{selectedDocPreview.referenceNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">Date Issued</span>
                <span className="font-mono-numbers text-ink">{selectedDocPreview.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="label-overline">File Specification</span>
                <span className="font-mono-numbers text-ink">{selectedDocPreview.fileSize} (Cryptographically Sealed)</span>
              </div>
              <div className="border-t border-line pt-4 text-[11px] leading-relaxed text-tint">
                This document is certified by ECHO System Security. Any alterations invalidate digital signatures. Retain for corporate compliance and financial tax records.
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-line pt-4">
              <button onClick={() => setSelectedDocPreview(null)} className="btn-ghost">
                Close
              </button>
              <button
                onClick={() => {
                  handleDownload(selectedDocPreview);
                  setSelectedDocPreview(null);
                }}
                className="btn-dark"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.75} />
                <span>Download Certified Copy</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};