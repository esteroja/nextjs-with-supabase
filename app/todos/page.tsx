import { createClient } from "@/utils/supabase/server";
import Page from "@/components/todos/todo";

export default async function Index() {
  const supabase = createClient();

  let { data: todos, error } = await supabase.from("todos").select("*");

  if (!todos || todos.length === 0) return <h1>no todos found</h1>;

  async function create() {
    'use server'
 
    // ...
  }
  return (
    <div>
      {JSON.stringify(todos)}
      <Page />
    </div>
  );
}
