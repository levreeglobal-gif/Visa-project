'use client';
import { deleteBlogPostAction } from '../actions';
export default function DeleteBlogForm({ id, csrf }: { id: number; csrf: string }) {
  return <form action={deleteBlogPostAction} onSubmit={(event) => { if (!window.confirm('Delete this article permanently? This cannot be undone.')) event.preventDefault(); }}><input type="hidden" name="csrf" value={csrf} /><input type="hidden" name="id" value={id} /><input type="hidden" name="confirm" value="yes" /><button className="admin-link-button admin-danger-text" type="submit">Delete article</button></form>;
}
