revoke execute on function public.has_role(uuid, public.app_role) from public;
revoke execute on function public.has_role(uuid, public.app_role) from anon;
-- authenticated still needs EXECUTE so RLS policies can call it during their queries
grant execute on function public.has_role(uuid, public.app_role) to authenticated;