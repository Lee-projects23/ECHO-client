import React, { useState } from 'react';
import { useEcho } from '../../context/EchoContext';
import { BackToHome } from '../common/BackToHome';
import { img } from '../../lib/assets';
import { Send, Mic, Lock, FileText, Image as ImageIcon } from 'lucide-react';
import { ChatGroup } from '../../types/echo';

export const GroupChatView: React.FC = () => {
  const {
    chatGroups,
    sendChatMessage,
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
        url: img('evidence_after_irrigation_1790239183925.jpg'),
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
    <div className="mx-auto w-full max-w-[1180px] px-5 py-10 sm:px-8 sm:py-16">
      <BackToHome />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-line pb-8 sm:flex-row sm:items-end">
        <div>
          <span className="section-kicker">Tri-Party Operational Comms</span>
          <h1 className="h-display mt-1">Group Chat</h1>
          <p className="mt-1 text-sm text-tint">
            Direct operational channels uniting Client, ECHO Admin, and assigned Employees.
          </p>
        </div>

        {/* Admin-created group rule banner */}
        <div className="flex items-center gap-2 rounded-xl border border-line bg-tray px-3 py-2 text-[11px] text-tint">
          <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
          <span>Groups are created and managed exclusively by ECHO Operations.</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="mt-8 min-h-[600px] overflow-hidden rounded-3xl border border-line bg-white/40 dark:bg-[#0b0b0b]/20 lg:grid lg:grid-cols-12">
        {/* Left Column: Conversation Channels */}
        <div className="flex flex-col border-b border-line lg:col-span-4 lg:border-b-0 lg:border-r">
          <div className="border-b border-line bg-tray px-5 py-4">
            <span>Operational Channels ({chatGroups.length})</span>
          </div>

          <div className="max-h-[460px] flex-1 divide-y divide-line overflow-y-auto">
            {chatGroups.map(grp => {
              const isSelected = grp.groupId === activeGroupId;
              return (
                <div
                  key={grp.groupId}
                  onClick={() => setActiveGroupId(grp.groupId)}
                  className={`cursor-pointer px-5 py-4 transition-colors ${
                    isSelected
                      ? 'bg-tray'
                      : 'hover:bg-tray/60'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="label-overline">{grp.siteName}</span>
                    <span className="font-mono-numbers text-[11px] text-faint">{grp.lastMessageTime}</span>
                  </div>

                  <h4 className="mt-1 text-sm font-semibold tracking-wide text-ink">{grp.name}</h4>

                  <p className="mt-1 truncate text-xs text-tint">{grp.lastMessage}</p>

                  <div className="mt-2.5 flex items-center gap-2 font-mono-numbers text-[10px] text-faint">
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
        <div className="flex flex-col justify-between lg:col-span-8">
          {activeGroup ? (
            <>
              {/* Conversation Header */}
              <div className="flex flex-col justify-between gap-3 border-b border-line bg-tray/50 px-5 py-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-medium tracking-[-0.01em] text-ink">{activeGroup.name}</h3>
                    <span className="rounded-full border border-line px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-faint">
                      Active Channel
                    </span>
                  </div>
                  <p className="mt-0.5 font-mono-numbers text-xs text-faint">
                    Site: {activeGroup.siteName} · ECHO Admin: {activeGroup.adminName}
                  </p>
                </div>

                {/* Participants List */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-tint">
                  <span className="label-overline">Assigned</span>
                  <div className="flex flex-wrap items-center gap-1">
                    {activeGroup.assignedEmployees.map((name: string) => (
                      <span
                        key={name}
                        className="rounded-full bg-tray px-2 py-0.5 text-[11px] font-medium text-ink ring-1 ring-line"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Message Stream */}
              <div className="max-h-[500px] flex-1 space-y-5 overflow-y-auto p-4 sm:p-6">
                {activeGroup.messages.map(msg => {
                  const isClient = msg.senderRole === 'client';
                  const isAdmin = msg.senderRole === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender Meta */}
                      <div className="mb-1 flex items-center gap-2 px-1">
                        <span className="text-xs font-medium text-tint">{msg.senderName}</span>
                        <span
                          className={`rounded-full border px-1.5 py-px text-[10px] font-semibold uppercase tracking-[0.12em] ${
                            isClient
                              ? 'border-accent/40 text-accent'
                              : isAdmin
                              ? 'border-linestrong text-tint'
                              : 'border-line text-faint'
                          }`}
                        >
                          {msg.senderRole}
                        </span>
                        <span className="font-mono-numbers text-[10px] text-faint">{msg.timestamp}</span>
                      </div>

                      {/* Message Bubble */}
                      <div
                        className={`max-w-md rounded-2xl p-3.5 text-sm ${
                          isClient
                            ? 'bg-cta text-ctafg'
                            : isAdmin
                            ? 'rounded-ts-none bg-raise text-ink ring-1 ring-line'
                            : 'rounded-ts-none bg-tray text-ink'
                        }`}
                      >
                        {msg.text && <p className="leading-relaxed">{msg.text}</p>}

                        {/* Attachments */}
                        {msg.attachment && (
                          <div className="mt-2.5 border-t border-line/60 pt-2">
                            {msg.attachment.type === 'image' && msg.attachment.url && (
                              <div className="mt-1 overflow-hidden rounded-xl border border-line">
                                <img
                                  src={msg.attachment.url}
                                  alt={msg.attachment.name}
                                  referrerPolicy="no-referrer"
                                  className="h-full w-full object-cover"
                                />
                              </div>
                            )}

                            {msg.attachment.type === 'document' && (
                              <div className="flex items-center gap-2 rounded-xl bg-black/5 px-3 py-2 font-mono-numbers text-xs text-inherit dark:bg-white/5">
                                <FileText className="h-4 w-4 shrink-0" strokeWidth={1.75} />
                                <span className="truncate">{msg.attachment.name}</span>
                                <span className="text-[10px] opacity-75">{msg.attachment.size}</span>
                              </div>
                            )}

                            {msg.attachment.type === 'audio' && (
                              <div className="flex items-center justify-between gap-3 rounded-xl bg-black/5 px-3 py-2 font-mono-numbers text-xs text-inherit dark:bg-white/5">
                                <div className="flex min-w-0 items-center gap-2">
                                  <Mic className="h-3.5 w-3.5 shrink-0 text-red-500" strokeWidth={1.75} />
                                  <span className="truncate">{msg.attachment.name}</span>
                                  <span className="shrink-0 text-[10px] opacity-75">
                                    ({msg.attachment.duration})
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handlePlayVoice(msg.id)}
                                  className="shrink-0 cursor-pointer rounded-full bg-ink px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-ctafg"
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
              <div className="border-t border-line bg-tray/40 px-4 py-4 sm:px-5">
                {/* Quick Attachment Triggers */}
                <div className="mb-2 flex items-center gap-2 text-xs text-faint">
                  <span>Attach:</span>
                  <button
                    type="button"
                    onClick={() => handleSendMockAttachment('image')}
                    className="flex cursor-pointer items-center gap-1 transition-colors hover:text-ink"
                  >
                    <ImageIcon className="h-3 w-3" strokeWidth={1.75} />
                    <span>Photo</span>
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSendMockAttachment('document')}
                    className="flex cursor-pointer items-center gap-1 transition-colors hover:text-ink"
                  >
                    <FileText className="h-3 w-3" strokeWidth={1.75} />
                    <span>Document</span>
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => handleSendMockAttachment('audio')}
                    className="flex cursor-pointer items-center gap-1 transition-colors hover:text-ink"
                  >
                    <Mic className="h-3 w-3 text-red-500" strokeWidth={1.75} />
                    <span>Voice Memo</span>
                  </button>
                </div>

                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder="Type your message to operations..."
                    className="input-field flex-1 bg-raise font-sans"
                  />
                  <button
                    type="submit"
                    className="btn-dark shrink-0 px-4 py-2.5"
                  >
                    <span>Send</span>
                    <Send className="h-3.5 w-3.5" strokeWidth={1.75} />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs font-semibold uppercase tracking-[0.16em] text-faint">
              No active group conversation selected.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};