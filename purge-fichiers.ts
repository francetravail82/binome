// supabase/functions/purge-fichiers/index.ts
// Supprime du stockage les PDF des CV effacés ou expirés (liste dans la table fichiers_a_purger).
//
// Mise en place :
//   1. Créez le dossier supabase/functions/purge-fichiers/ et copiez ce fichier en index.ts
//   2. supabase functions deploy purge-fichiers --no-verify-jwt=false
//   3. Planifiez-la chaque nuit après la purge SQL (Supabase > Edge Functions > Schedule, ou pg_cron + pg_net),
//      en l'appelant avec la clé "service_role" dans l'en-tête Authorization.
// Les variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont fournies automatiquement par Supabase.
import { createClient } from "npm:@supabase/supabase-js@2";

Deno.serve(async () => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const { data: lignes, error } = await supabase
    .from("fichiers_a_purger")
    .select("chemin")
    .limit(500);
  if (error) return new Response(error.message, { status: 500 });
  if (!lignes?.length) return new Response("Rien à supprimer");

  const chemins = lignes.map((l) => l.chemin);
  const { error: errStorage } = await supabase.storage.from("cv").remove(chemins);
  if (errStorage) return new Response(errStorage.message, { status: 500 });

  await supabase.from("fichiers_a_purger").delete().in("chemin", chemins);
  return new Response(`${chemins.length} fichier(s) supprimé(s)`);
});
