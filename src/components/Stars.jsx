export default function Stars({ count, max = 3, small = false, animate = false }) {
  return (
    <div className={`flex justify-center gap-0.5 ${small ? '' : 'gap-2'}`}>
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`${small ? 'text-base' : 'text-4xl'} transition-all duration-300 ${
            animate ? `delay-${i * 200}` : ''
          } ${i < count ? 'opacity-100' : 'opacity-20'}`}
          style={animate ? { animationDelay: `${i * 0.2}s` } : {}}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}
