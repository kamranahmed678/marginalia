/** Ambient aurora — a few slow, blurred colour fields drifting behind the page. */
export default function Background() {
  return (
    <div className="aurora" aria-hidden="true">
      <div className="blob b1" />
      <div className="blob b2" />
      <div className="blob b3" />
    </div>
  );
}
