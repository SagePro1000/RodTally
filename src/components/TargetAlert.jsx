export default function TargetAlert({ reached, current, target, type }) {
  if (!reached) return null;

  return (
    <div className="target-alert" role="alert">
      <div className="target-alert-content">
        <span className="target-alert-text">Target reached!</span>
        You've reached {current} {type}. Target was {target} {type}. Tap Reset to save.
      </div>
    </div>
  );
}
