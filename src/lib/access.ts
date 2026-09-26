// What people can use without an account. These limits only apply when
// accounts are switched on: without an account service there is no way to
// sign up, so everything stays open to everyone.
import { accountsOn } from './accounts';

/** Question-bank answers a guest can give each day. */
export const GUEST_DAILY = 20;
/** Questions a guest sees in each topic's practice set. */
export const TOPIC_PREVIEW = 5;
/** True when some tools ask for a free account. */
export const gated = accountsOn;
