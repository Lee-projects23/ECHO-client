import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { Send, Paperclip, Mic, Lock, ShieldCheck, Play, FileText, Image as ImageIcon } from 'lucide-react';
import { ChatGroup } from '../../types/echo';

export const GroupChatView: React.FC = () => {
  const {
    chatGroups,
    sendChatMessage,
    client,
  } = useEcho();

  const [activeGroupId, setActiveGroupId] = useState<string>(chatGroups[0]?.groupId || '');
  const [inputText, setInputText] = useState('');
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);

  const activeGroup = chatGroups.find(g => g.groupId === activeGroupId) || chatGroups[0];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    sendChatMessage(activeGroup.groupId, inputText.trim());
    setInputText('');
  };

  const handleSendMockAttachment = (type: 'image' | 'document' | 'audio') => {
    if (type === 'image') {
      sendChatMessage(activeGroup.groupId, 'Attached field photo for review:', {
        type: 'image',
        name: 'site_valve_photo.jpg',
        url: '/src/assets/images/evidence_after_irrigation_1790239183925.jpg',
      });
    } else if (type === 'document') {
      sendChatMessage(activeGroup.groupId, 'Attached maintenance signoff document:', {
        type: 'document',
        name: 'gate_pass_slip.pdf',
        size: '145 KB',
      });
    } else if (type === 'audio') {
      sendChatMessage(activeGroup.groupId, 'Voice briefing memo attached:', {
        type: 'audio',
        name: 'voice_memo_briefing.m4a',
        duration: '0:28',
      });
    }
  };

  const handlePlayVoice = (msgId: string) => {
    setPlayingVoiceId(msgId);
    setTimeout(() => {
      setPlayingVoiceId(null);
    }, 2800);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <BackToHome />

      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-[0.25em] text-stone-500 dark:text-stone-400">
            Tri-Party Operational Comms
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl font-normal text-stone-900 dark:text-stone-100 tracking-tight mt-1">
            Group Chat
          </h1>
          <p className="text-stone-600 dark:text-stone-400 text-sm mt-1 font-mono">
            Direct operational channels uniting Client, ECHO Admin, and assigned Employees.
          </p>
        </div>

        {/* Admin-created group rule banner */}
        <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-800 px-3 py-2 bg-stone-100/50 dark:bg-stone-900/30 flex items-center gap-2">
          <Lock className="w-3.5 h-3.5 text-stone-500 shrink-0" />
          <span>Groups are created and managed exclusively by ECHO Operations.</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border border-stone-200 dark:border-stone-800 bg-white/40 dark:bg-stone-900/20 mt-8 min-h-[600px]">
        {/* Left Column: Conversation Channels */}
        <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-stone-200 dark:border-stone-800 flex flex-col">
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/60">
            <span className="text-[11px] font-mono uppercase tracking-widest text-stone-500 dark:text-stone-400">
              Assigned Operational Channels ({chatGroups.length})
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-stone-200/60 dark:divide-stone-800/60">
            {chatGroups.map(grp => {
              const isSelected = grp.groupId === activeGroupId;
              return (
                <div
                  key={grp.groupId}
                  onClick={() => setActiveGroupId(grp.groupId)}
                  className={`p-4 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-stone-200/70 dark:bg-stone-800/70'
                      : 'hover:bg-stone-100/50 dark:hover:bg-stone-800/30'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      {grp.siteName}
                    </span>
                    <span className="text-[11px] font-mono text-stone-400">
                      {grp.lastMessageTime}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-stone-900 dark:text-stone-100 mt-1 font-mono">
                    {grp.name}
                  </h4>

                  <p className="text-xs text-stone-600 dark:text-stone-400 truncate mt-1 font-sans">
                    {grp.lastMessage}
                  </p>

                  <div className="mt-2.5 flex items-center gap-2 text-[10px] font-mono text-stone-400">
                    <span>Admin: {grp.adminName}</span>
                    <span>·</span>
                    <span>{grp.assignedEmployees.length} Specialists</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Conversation Stream & Input */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          {activeGroup ? (
            <>
              {/* Conversation Header */}
              <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-stone-800 bg-stone-100/40 dark:bg-stone-950/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-editorial text-xl font-normal text-stone-900 dark:text-stone-100">
                      {activeGroup.name}
                    </h3>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400">
                      Active Channel
                    </span>
                  </div>
                  <p className="text-xs font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                    Site: {activeGroup.siteName} · ECHO Admin: {activeGroup.adminName}
                  </p>
                </div>

                {/* Participants List */}
                <div className="flex items-center gap-1.5 text-xs font-mono text-stone-500">
                  <span className="text-[10px] uppercase text-stone-400">Assigned:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {activeGroup.assignedEmployees.map((name: string) => (
                      <span
                        key={name}
                        className="px-2 py-0.5 bg-stone-200/80 dark:bg-stone-800/80 text-stone-800 dark:text-stone-200 text-[11px]"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5 max-h-[500px]">
                {activeGroup.messages.map(msg => {
                  const isClient = msg.senderRole === 'client';
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender Meta */}
                      <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-xs font-mono font-medium text-stone-700 dark:text-stone-300">
                          {msg.senderName}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-1 border border-stone-300 dark:border-stone-700 text-stone-500">
                          {msg.senderRole}
                        </span>
                        <span className="text-[10px] font-mono text-stone-400">
                          {msg.timestamp}
                        </span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-md p-3.5 text-sm font-sans ${
                          isClient
                            ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-950'
                            : isAdmin
                            ? 'bg-stone-200/80 dark:bg-stone-800/80 text-stone-900 dark:text-stone-100 border border-stone-300 dark:border-stone-700'
                            : 'bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                        {/* Attachments */}
                        {msg.attachment && (
                          <div className="mt-2.5 pt-2 border-t border-stone-400/30 dark:border-stone-600/30">
                            {msg.attachment.type === 'image' && msg.attachment.url && (
                              <div className="mt-1 aspect-video overflow-hidden border border-stone-300 dark:border-stone-700">
                                <img
                                  src={msg.attachment.url}
                                  alt={msg.attachment.name}
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            )}

                            {msg.attachment.type === 'document' && (
                              <div className="flex items-center gap-2 text-xs font-mono p-2 bg-black/10 dark:bg-white/10">
                                <FileText className="w-4 h-4 shrink-0" />
                                <span className="truncate">{msg.attachment.name}</span>
                                <span className="text-[10px] opacity-75">{msg.attachment.size}</span>
                              </div>
                            )}

                            {msg.attachment.type === 'audio' && (
                              <div className="flex items-center justify-between gap-3 text-xs font-mono p-2 bg-black/10 dark:bg-white/10">
                                <div className="flex items-center gap-2">
                                  <Mic className="w-3.5 h-3.5 text-red-500" />
                                  <span>{msg.attachment.name}</span>
                                  <span className="text-[10px] opacity-75">({msg.attachment.duration})</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handlePlayVoice(msg.id)}
                                  className="px-2 py-1 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 text-[10px] uppercase font-mono cursor-pointer"
                                >
                                  {playingVoiceId === msg.id ? 'Playing...' : 'Play'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Message Composer */}
              <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-950/50">
                {/* Quick Attachment Triggers */}
                <div className="flex items-center gap-2 mb-2 text-xs font-mono text-stone-500">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400">Attach:</span>
                  <button
                    type="button"
                    onClick={() => handleSendMockAttachment('image')}
                    className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 cursor-pointer"
                  >
                    <ImageIcon className="w-3 h-3" />
                    <span>Photo</span>
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSendMockAttachment('document')}
                    className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3 h-3" />
                    <span>Document</span>
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSendMockAttachment('audio')}
                    className="hover:text-stone-900 dark:hover:text-stone-100 flex items-center gap-1 cursor-pointer"
                  >
                    <Mic className="w-3 h-3 text-red-500" />
                    <span>Voice Memo</span>
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Type your message to operations..."
                    className="flex-1 bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 px-3.5 py-2.5 text-xs font-sans text-stone-900 dark:text-stone-100 focus:outline-none focus:border-stone-900 dark:focus:border-stone-100"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-stone-950 text-white dark:bg-stone-100 dark:text-stone-950 hover:bg-stone-800 dark:hover:bg-stone-200 text-xs font-mono tracking-wider uppercase transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-stone-500">
              No active group conversation selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
