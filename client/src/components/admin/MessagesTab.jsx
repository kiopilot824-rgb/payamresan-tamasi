import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { ArrowUpDown, EyeOff, Megaphone, MessageCircleMore, Paperclip, Pencil, User, Users } from "../../icons/lucide.js";
import { api, cardCls, fmtDateTime, DEFAULT_PAGE_SIZE } from "./adminShared.js";
import { LoadingRows, EmptyState, FilterPopover, FilterDropdown, Pagination, TabToolbar, TabSearchInput } from "./AdminCommon.jsx";
import Avatar from "../common/Avatar.jsx";
import Tooltip from "../common/Tooltip.jsx";
import { hasPersian } from "../../utils/fontUtils.js";

const CHAT_TYPE_ICONS = {
  dm: MessageCircleMore,
  group: Users,
  channel: Megaphone,
  saved: MessageCircleMore,
};

// Chat label for the picker dropdown: DMs show "Alice & Bob", others their name.
function pickerChatLabel(c) {
  if (c.type === "dm") {
    const pair = [c.member1, c.member2].filter(Boolean).join(" & ");
    return pair || `DM #${String(c.id).slice(0, 8)}`;
  }
  if (c.type === "saved") return c.name || "Saved Messages";
  return c.name || `Chat #${String(c.id).slice(0, 8)}`;
}

const MessagesTab = forwardRef(function MessagesTab({ active = true, onStatsChange }, ref) {
  const [messages, setMessages]     = useState([]);
  const [total, setTotal]           = useState(0);
  const [page, setPage]             = useState(1);
  const [pageSize, setPageSize]     = useState(DEFAULT_PAGE_SIZE);
  const [initialized, setInitialized] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [search, setSearch]         = useState("");
  const [chatId, setChatId]         = useState("");
  const [userId, setUserId]         = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortDir, setSortDir]       = useState("DESC");
  const [allChats, setAllChats]     = useState([]);
  const [users, setUsers]           = useState([]);
  const debounceRef  = useRef(null);
  const requestIdRef = useRef(0);

  // The chat picker spans every conversation type — including private DMs,
  // which the admin Chats tab intentionally does not list.
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    api.get("/api/admin/all-chats?limit=500")
      .then((data) => { if (!cancelled) setAllChats(data.chats ?? []); })
      .catch(() => {});
    api.get("/api/admin/users?limit=200&sortBy=created_at&sortDir=DESC")
      .then((data) => { if (!cancelled) setUsers(data.users ?? []); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [active]);

  const trimmedSearch = search.trim();
  const fetchPage = useCallback(async (targetPage) => {
    const requestId = ++requestIdRef.current;
    setLoading(true);
    const offset = (Math.max(1, targetPage) - 1) * pageSize;
    const params = new URLSearchParams({
      limit: String(pageSize),
      offset: String(offset),
      sortDir,
    });
    if (trimmedSearch) params.set("search", trimmedSearch);
    if (chatId) params.set("chat_id", chatId);
    if (userId) params.set("user_id", userId);
    if (typeFilter) params.set("type", typeFilter);
    try {
      const data = await api.get(`/api/admin/messages?${params.toString()}`);
      if (requestId !== requestIdRef.current) return;
      setMessages(data.messages ?? []);
      setTotal(Number(data.total || 0));
      setInitialized(true);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setInitialized(true);
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [trimmedSearch, chatId, userId, typeFilter, sortDir, pageSize]);

  useEffect(() => {
    if (!active) return undefined;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchPage(page), 250);
    return () => clearTimeout(debounceRef.current);
  }, [active, page, fetchPage]);

  const refresh = useCallback(() => fetchPage(page), [fetchPage, page]);
  useImperativeHandle(ref, () => ({ refresh }), [refresh]);

  const changeSearch = (value) => { setSearch(value); setPage(1); };
  const changeChat   = (value) => { setChatId(value); setPage(1); };
  const changeUser   = (value) => { setUserId(value); setPage(1); };
  const changeType   = (value) => { setTypeFilter(value); setPage(1); };
  const changeSort   = (value) => { setSortDir(value); setPage(1); };
  const changePageSize = (value) => { setPageSize(value); setPage(1); };

  const chatOptions = [["", "All chats"], ...allChats.map((c) => [c.id, pickerChatLabel(c)])];
  const userOptions = [
    ["", "All senders"],
    ...users.map((u) => [u.id, u.nickname ? `${u.nickname} (@${u.username})` : `@${u.username}`]),
  ];
  const typeSections = [
    {
      id: "type",
      label: "Chat Type",
      value: typeFilter,
      onChange: changeType,
      options: [["", "All types"], ["dm", "Direct messages"], ["group", "Groups"], ["channel", "Channels"]],
    },
  ];

  return (
    <div className="space-y-3">
      <TabToolbar>
        <TabSearchInput value={search} onChange={changeSearch} placeholder="Search messages…" />
        <FilterDropdown value={chatId} onChange={changeChat} options={chatOptions} icon={MessageCircleMore} />
        <FilterDropdown value={userId} onChange={changeUser} options={userOptions} icon={User} />
        <FilterPopover sections={typeSections} onReset={() => changeType("")} />
        <Tooltip label="Toggle order">
          <button type="button" onClick={() => changeSort(sortDir === "DESC" ? "ASC" : "DESC")}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-200/70 bg-white/90 text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-500/30 dark:bg-slate-900/50 dark:text-slate-300 dark:hover:bg-emerald-500/5"
            aria-label="Toggle order">
            <ArrowUpDown size={15} className="text-emerald-500 icon-anim-nudge" />
          </button>
        </Tooltip>
      </TabToolbar>

      {!initialized ? <LoadingRows /> : messages.length === 0 ? <EmptyState message="No messages found." /> : (
        <>
          <div className="space-y-2">
            {messages.map((m) => {
              const senderName = m.sender?.nickname || m.sender?.username || "Unknown";
              const nameHasPersian = hasPersian(senderName) || hasPersian(m.body);
              const bodyHasPersian = hasPersian(m.body);
              const ChatIcon = CHAT_TYPE_ICONS[m.chat_type] || MessageCircleMore;
              const displayBody = m.edited && m.edited_body ? m.edited_body : m.body;
              return (
                <div key={`${m.chat_id}-${m.id}`} className={"p-3 " + cardCls}>
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={m.sender?.avatar_url}
                      name={senderName}
                      color={m.sender?.color || "#10b981"}
                      className="h-10 w-10 shrink-0 text-sm font-bold text-white"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className={`truncate text-sm font-semibold text-slate-700 dark:text-slate-200 ${nameHasPersian ? "font-fa" : ""}`} dir="auto">
                          {senderName}
                        </span>
                        {m.sender?.username && (
                          <span className="truncate text-[11px] text-slate-400">@{m.sender.username}</span>
                        )}
                        <span className="inline-flex max-w-full items-center gap-1 rounded-full border border-emerald-200/70 bg-emerald-50/60 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <ChatIcon size={11} className="shrink-0" />
                          <span className={`truncate ${hasPersian(m.chat_label) ? "font-fa" : ""}`} dir="auto">{m.chat_label}</span>
                        </span>
                        {Boolean(m.edited) && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200/70 bg-amber-50/60 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                            <Pencil size={10} className="shrink-0" /> Edited
                          </span>
                        )}
                        {m.hidden_everyone_at && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-rose-200/70 bg-rose-50/60 px-2 py-0.5 text-[10px] font-semibold text-rose-600 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300">
                            <EyeOff size={10} className="shrink-0" /> Hidden
                          </span>
                        )}
                        {m.file_count > 0 && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-slate-200/80 bg-slate-50/60 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                            <Paperclip size={10} className="shrink-0" /> {m.file_count}
                          </span>
                        )}
                        <span className="ms-auto shrink-0 text-[11px] text-slate-400 dark:text-slate-500">{fmtDateTime(m.created_at)}</span>
                      </div>
                      {displayBody ? (
                        <p className={`mt-1.5 whitespace-pre-wrap break-words text-sm text-slate-600 dark:text-slate-300 ${bodyHasPersian ? "font-fa" : ""}`} dir="auto">
                          {displayBody}
                        </p>
                      ) : (
                        <p className="mt-1.5 text-sm italic text-slate-400 dark:text-slate-500">
                          {m.file_count > 0 ? "Attachment" : "Empty message"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage}
            onPageSizeChange={changePageSize} busy={loading} />
        </>
      )}
    </div>
  );
});

export default MessagesTab;
