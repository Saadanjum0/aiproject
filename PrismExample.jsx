import Prism from './Prism';

function PrismExample() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Prism
        animationType="rotate"
        timeScale={0.5}
        height={3.5}
        baseWidth={5.5}
        scale={3.6}
        hueShift={0}
        colorFrequency={1}
        noise={0.5}
        glow={1}
      />
    </div>
  );
}

export default PrismExample;
