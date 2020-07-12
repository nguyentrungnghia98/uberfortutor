import TagSkillClass from './tagSkill';
import UserClass from './user';
import ContractClass from './contract';
import ConversationClass from './conversation';
import ReceiptClass from './receipt';

export const TagSkill = new TagSkillClass();
export const User = new UserClass();
export const Contract = new ContractClass();
export const Conversation = new ConversationClass();
export const Receipt = new ReceiptClass();
export default {
  TagSkill,
  User,
  Contract,
  Conversation,
  Receipt
}