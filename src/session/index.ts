import { type Conversation, type ConversationFlavor } from '@grammyjs/conversations'
import type { Context, SessionFlavor } from 'grammy'

export interface RamSession {}

export type SessionContext = Context & SessionFlavor<RamSession>
export type BotContext = SessionContext & ConversationFlavor
export type ConversationContext = Conversation<BotContext>
