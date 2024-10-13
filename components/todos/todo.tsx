"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/button";
import { useAuth } from "@/app/context/AuthContext";

export default function Page() {
  const [todos, setTodos] = useState<any[] | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const {user} = useAuth();

  useEffect(() => {
    console.log("User Authentication Info:", user);
    const getData = async () => {
      const { data } = await supabase.from("todos").select();
      console.log("client read");
      setTodos(data);
      router.refresh();
    };
    getData();
  }, [supabase, user]);

  const addTodoAction = async () => {
    const supabase = createClient();

    const { error } = await supabase
      .from("todos")
      .insert([{ title: "client task", priority: 3 }])
      .select();

    if (error) {
      console.error("Error adding client todo:", error);
    } else {
      const { data } = await supabase.from("todos").select();
      setTodos(data);
      console.log("client create");
      router.refresh();
    }
  };

  const deleteTodoAction = async (formData: FormData) => {
    const id = formData.get("id");
    const supabase = createClient();
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      console.error("Error deleting client todo:", error);
    } else {
      const { data } = await supabase.from("todos").select();
      setTodos(data);
      console.log("client delete");
      router.refresh();
    }
  };

  const updateTodoAction = async (formData: FormData) => {
    const id = formData.get("id");

    const supabase = createClient();
    const { error } = await supabase
      .from("todos")
      .update([{ title: "updated client task", priority: 2 }])
      .eq("id", id);
    if (error) {
      console.error("Error updating client todo:", error);
    } else {
      const { data } = await supabase.from("todos").select();
      setTodos(data);
      console.log("client update");
      router.refresh();
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CLIENT SIDE</h1>

      <form action={addTodoAction} className="mb-4">
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
                  action={deleteTodoAction}
                  style={{ display: "inline", marginLeft: "10px" }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <Button type="submit">DELETE</Button>
                </form>
                <form
                  action={updateTodoAction}
                  style={{ display: "inline", marginLeft: "10px" }}
                >
                  <input type="hidden" name="id" value={todo.id} />
                  <Button type="submit">UPDATE</Button>
                </form>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
