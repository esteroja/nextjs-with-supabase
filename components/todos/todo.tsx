"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [notes, setNotes] = useState<any[] | null>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const getData = async () => {
      const { data } = await supabase.from("todos").select();
      setNotes(data);
    };
    getData();
  }, []);

  const addTodoAction = async () => {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("todos")
      .insert([{ title: "task new", priority: 4 }])
      .select();
      router.refresh();

    return data;
  };

  return (
    <>
      <pre>{JSON.stringify(notes, null, 2)}</pre>
      <form action={addTodoAction}>
        <button type="submit">Add todo</button>
      </form>
    </>
  );
}
