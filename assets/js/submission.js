// Deliberately no fetch, endpoint, key, live adapter, or persistent storage.
// Later phases can introduce a separately reviewed delivery implementation.
export async function previewSubmission() {
  return Object.freeze({ mode: 'mock', sent: false });
}
