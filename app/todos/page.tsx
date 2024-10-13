import { createClient } from "@/utils/supabase/server";
import Page from "@/components/todos/todo";
import { revalidatePath } from "next/cache";
import Button from "@/components/button";

export default async function Index() {
  "use server";
  const supabase = createClient();

  let { data: todos, error } = await supabase.from("todos").select("*");
  console.log("server read");

  if (error) return <h1>Error fetching server todos</h1>;

  async function createTodo() {
    "use server";
    const supabase = createClient();

    let { data: todos, error } = await supabase
      .from("todos")
      .insert([{ title: "server task", priority: 3 }])
      .select();

    if (error) return <h1>Error adding server todo</h1>;

    revalidatePath("/todo");
    return JSON.stringify(todos, null, 2);
  }

  async function updateTodo(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const supabase = createClient();

    let { data: todos, error } = await supabase
      .from("todos")
      .update([{ title: "updated server task", priority: 2 }])
      .eq("id", id);

    if (error) return <h1>Error updating server todo</h1>;
    revalidatePath("/todo");
    console.log("server update");

    return JSON.stringify(todos, null, 2);
  }

  async function deleteTodo(formData: FormData) {
    "use server";
    const id = formData.get("id");
    const supabase = createClient();

    let { data: todos, error } = await supabase
      .from("todos")
      .delete()
      .eq("id", id);

    if (error) return <h1>Error deleting server todo</h1>;
    revalidatePath("/todo");
    console.log("server delete");
    return JSON.stringify(todos, null, 2);
  }
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">SERVER SIDE</h1>

      <form action={createTodo} className="mb-4">
        <Button type="submit">Add Todo</Button>
      </form>

      <ul className="bg-white shadow-md rounded-md divide-y mb-4">
        {todos &&
          todos.map((todo) => (
            <li key={todo.id} className="p-2 flex items-center justify-between">
              <span>
                {todo.title} (Priority: {todo.priority})
              </span>
              <div>
                <form
                  action={deleteTodo}
                  style={{ display: "inline", marginLeft: "10px" }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <Button type="submit">DELETE</Button>
                </form>
                <form
                  action={updateTodo}
                  style={{ display: "inline", marginLeft: "10px" }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <Button type="submit">UPDATE</Button>
                </form>
              </div>
            </li>
          ))}
      </ul>
      <Page />
    </div>
  );
}
