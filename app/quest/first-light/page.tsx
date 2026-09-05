import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '../../../lib/supabase/server'
import { FocusSessionRow } from '../../../lib/timer/first-light'
import { QuestRunner } from './quest-runner'

export const dynamic = 'force-dynamic'

const FOCUS_SESSION_COLUMNS =
  'id, status, started_at, duration_seconds, accumulated_ms, paused_at, completed_at, rewarded_at, rest_finished_at, chest_opened_at'

export default async function FirstLightQuestPage() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/account')

  const { data: character } = await supabase
    .from('characters')
    .select('name')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!character) redirect('/character')

  const { data: session } = await supabase
    .from('focus_sessions')
    .select(FOCUS_SESSION_COLUMNS)
    .eq('profile_id', user.id)
    .eq('quest_key', 'ein-licht-im-unterholz')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle<FocusSessionRow>()

  return <QuestRunner characterName={character.name} initialSession={session ?? null} />
}
