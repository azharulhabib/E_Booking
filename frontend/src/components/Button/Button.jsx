'use client';
import { useFormStatus } from "react-dom";
import { useActionState } from 'react';
import { logoutUser } from "@/actions/logout";
import styles from "./Button.module.css";

export function LogoutButton() {
    const [state, action] = useActionState(logoutUser, { errors: null });
    const { pending } = useFormStatus()
  
    return (
      <form action={action}>
        <button disabled={pending} type="submit" className={styles.button}>
          {pending ? 'Logging out...' : 'Logout'}
        </button>
        {state.errors && <p className="text-red-500">{state.errors}</p>}
        
      </form>
    );
}