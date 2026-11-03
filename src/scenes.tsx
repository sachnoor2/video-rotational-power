import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Body, Card, Formula, Heading, Note, Rise, Stage} from './components/Bits';
import {Bars, Disc, PushBox} from './components/Figures';
import {palette, serifFamily} from './theme';

type SceneProps = {dur: number};

const row: React.CSSProperties = {display: 'flex', alignItems: 'center', gap: 26};

/* 01 ------------------------------------------------------------------ */
const Title: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const rotation = frame * 0.4;

  return (
    <Stage>
      <div style={{flex: 1.15, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Rise delay={0}>
          <div
            style={{
              fontSize: 23,
              letterSpacing: '0.3em',
              fontWeight: 700,
              color: palette.muted,
              textTransform: 'uppercase',
            }}
          >
            Rotational dynamics
          </div>
        </Rise>
        <Rise delay={9}>
          <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.02, marginTop: 26}}>
            Power in
            <br />
            Rotation
          </div>
        </Rise>
        <Rise delay={22}>
          <div style={{fontSize: 36, color: palette.inkSoft, marginTop: 30}}>
            Derived from absolute basics
          </div>
        </Rise>
        <Rise delay={Math.round(dur * 0.42)}>
          <div
            style={{
              marginTop: 56,
              display: 'flex',
              alignItems: 'center',
              gap: 30,
              backgroundColor: palette.amber,
              padding: '22px 40px',
              borderRadius: 22,
              width: 'fit-content',
            }}
          >
            <span style={{fontFamily: serifFamily, fontSize: 82}}>P = τ ω</span>
            <span style={{fontSize: 23, color: palette.amberDeep, fontWeight: 600, lineHeight: 1.3, maxWidth: 210}}>
              the result we will build
            </span>
          </div>
        </Rise>
      </div>
      <div style={{flex: 0.85, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={rotation} size={540} showRadius showAngle radiusLabel="r" angleLabel="θ" />
      </div>
    </Stage>
  );
};

/* 02 ------------------------------------------------------------------ */
const Work: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, dur], [-10, 60], {extrapolateRight: 'clamp'});

  return (
    <Stage kicker="Step one · work">
      <div style={{flex: 1}}>
        <Rise>
          <Heading>Start with work</Heading>
        </Rise>
        <Rise delay={10}>
          <Body style={{marginTop: 28}}>
            A force pushing a body through a distance does work.
          </Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.35)}>
          <Formula style={{marginTop: 46}}>W = F × d</Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.6)}>
          <Note style={{marginTop: 18}}>force times distance, nothing more</Note>
        </Rise>
      </div>
      <div style={{flex: 0.95, display: 'flex', justifyContent: 'center'}}>
        <PushBox shift={shift} />
      </div>
    </Stage>
  );
};

/* 03 ------------------------------------------------------------------ */
const Power: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const heights = [110, 150, 190, 235, 290].map((h, i) => {
    const start = Math.round(dur * (0.1 + i * 0.08));
    const p = spring({frame: frame - start, fps, config: {damping: 200, mass: 0.6}});
    return Math.max(3, h * p);
  });

  return (
    <Stage kicker="Step two · power">
      <div style={{flex: 1}}>
        <Rise>
          <Heading size={64}>Power is work per unit time</Heading>
        </Rise>
        <Rise delay={12}>
          <Formula size={70} style={{marginTop: 44}}>
            P = W / t
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.4)}>
          <Formula size={52} color={palette.inkSoft} style={{marginTop: 26}}>
            P = (F × d) / t
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.62)}>
          <Note style={{marginTop: 22}}>same work in less time means more power</Note>
        </Rise>
      </div>
      <div style={{flex: 0.9, display: 'flex', justifyContent: 'center'}}>
        <Bars heights={heights} caption="work done per second" />
      </div>
    </Stage>
  );
};

/* 04 ------------------------------------------------------------------ */
const Linear: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const shift = interpolate(frame, [0, dur], [-6, 80], {extrapolateRight: 'clamp'});

  return (
    <Stage kicker="Step three · the straight line case">
      <div style={{flex: 1}}>
        <Rise>
          <Heading size={64}>The straight line result</Heading>
        </Rise>
        <Rise delay={10}>
          <Body style={{marginTop: 26}}>
            Distance over time is velocity, so the formula simplifies.
          </Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.32)}>
          <div style={{...row, marginTop: 44}}>
            <Formula size={96} color={palette.indigo}>
              P = F v
            </Formula>
          </div>
        </Rise>
        <Rise delay={Math.round(dur * 0.58)}>
          <Note style={{marginTop: 24}}>power equals force times velocity</Note>
        </Rise>
      </div>
      <div style={{flex: 0.9, display: 'flex', justifyContent: 'center'}}>
        <PushBox shift={shift} forceLabel="F" distanceLabel="v" accent={palette.indigo} />
      </div>
    </Stage>
  );
};

/* 05 ------------------------------------------------------------------ */
const Circle: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const rotation = 12 + frame * 0.6;

  return (
    <Stage kicker="Step four · bend the line into a circle">
      <div style={{flex: 1}}>
        <Rise>
          <Heading>Now the body turns</Heading>
        </Rise>
        <Rise delay={10}>
          <Body style={{marginTop: 26}}>
            The body is pinned at a centre, and the force acts at some radius.
          </Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.4)}>
          <Card style={{marginTop: 40, width: 'fit-content'}}>
            <div style={{fontSize: 27, lineHeight: 1.6}}>
              <div>distance d becomes angle θ</div>
              <div style={{color: palette.muted}}>metres become radians</div>
            </div>
          </Card>
        </Rise>
      </div>
      <div style={{flex: 0.9, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={rotation} size={520} showRadius showAngle radiusLabel="r" angleLabel="θ" />
      </div>
    </Stage>
  );
};

/* 06 ------------------------------------------------------------------ */
const Torque: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const rotation = 20 + frame * 0.5;

  return (
    <Stage kicker="Step five · torque">
      <div style={{flex: 1}}>
        <Rise>
          <Heading>Two new quantities</Heading>
        </Rise>
        <Rise delay={10}>
          <Body style={{marginTop: 26}}>Torque measures the turning effect of the force.</Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.3)}>
          <Formula size={64} style={{marginTop: 34}}>
            τ = F × r
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.55)}>
          <Body size={29} style={{marginTop: 30}}>
            A small turn moves the rim a small distance: radius times the small angle.
          </Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.75)}>
          <Formula size={58} color={palette.teal} style={{marginTop: 20}}>
            Δs = r × Δθ
          </Formula>
        </Rise>
      </div>
      <div style={{flex: 0.9, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={rotation} size={520} showRadius showForce showAngle radiusLabel="r" forceLabel="F" angleLabel="Δθ" />
      </div>
    </Stage>
  );
};

/* 07 ------------------------------------------------------------------ */
const WorkRotation: React.FC<SceneProps> = ({dur}) => {
  return (
    <Stage kicker="Step six · work in rotation">
      <div style={{flex: 1}}>
        <Rise>
          <Heading size={64}>Work turns into torque</Heading>
        </Rise>
        <Rise delay={10}>
          <Body style={{marginTop: 24}}>Work is force times the distance moved along the rim.</Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.22)}>
          <Formula size={54} color={palette.inkSoft} style={{marginTop: 38}}>
            ΔW = F × Δs
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.36)}>
          <Formula size={54} color={palette.inkSoft} style={{marginTop: 14}}>
            ΔW = F × r × Δθ
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.44)}>
          <div
            style={{
              marginTop: 24,
              backgroundColor: palette.amber,
              borderRadius: 18,
              padding: '18px 34px',
              width: 'fit-content',
            }}
          >
            <Formula size={66}>ΔW = τ × Δθ</Formula>
          </div>
        </Rise>
      </div>
      <div style={{flex: 0.8, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={60} size={430} showRadius showForce radiusLabel="r" forceLabel="F" accent={palette.amberDeep} />
      </div>
    </Stage>
  );
};

/* 08 ------------------------------------------------------------------ */
const Derive: React.FC<SceneProps> = ({dur}) => {
  return (
    <Stage kicker="Step seven · divide by time">
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <Rise>
          <Heading size={58} style={{textAlign: 'center'}}>
            Divide the work by the time
          </Heading>
        </Rise>
        <Rise delay={12}>
          <div style={{...row, marginTop: 50, gap: 22}}>
            <Formula size={62}>P = ΔW / Δt</Formula>
            <span style={{fontSize: 40, color: palette.muted}}>=</span>
            <Formula size={62}>τ × Δθ / Δt</Formula>
          </div>
        </Rise>
        <Rise delay={Math.round(dur * 0.36)}>
          <Note style={{marginTop: 26}}>angle over time is angular velocity, ω</Note>
        </Rise>
        <Rise delay={Math.round(dur * 0.44)}>
          <div
            style={{
              marginTop: 34,
              backgroundColor: palette.amber,
              borderRadius: 26,
              padding: '26px 56px',
              display: 'flex',
              alignItems: 'center',
              gap: 34,
            }}
          >
            <Formula size={104}>P = τ ω</Formula>
            <span style={{fontSize: 24, color: palette.amberDeep, fontWeight: 600, maxWidth: 230, lineHeight: 1.35}}>
              power equals torque times angular velocity
            </span>
          </div>
        </Rise>
      </div>
    </Stage>
  );
};

/* 09 ------------------------------------------------------------------ */
const Units: React.FC<SceneProps> = ({dur}) => {
  const items = [
    {label: 'torque', value: 'τ', unit: 'newton metres'},
    {label: 'angular velocity', value: 'ω', unit: 'radians per second'},
    {label: 'power', value: 'τ ω', unit: 'joules per second, the watt'},
  ];

  return (
    <Stage kicker="Check · units">
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Rise>
          <Heading size={62}>The units must agree</Heading>
        </Rise>
        <div style={{display: 'flex', gap: 26, marginTop: 46}}>
          {items.map((item, i) => (
            <Rise key={item.label} delay={Math.round(dur * (0.14 + i * 0.12))}>
              <Card style={{width: 400, height: 250}}>
                <div style={{fontSize: 20, letterSpacing: '0.16em', textTransform: 'uppercase', color: palette.muted, fontWeight: 700}}>
                  {item.label}
                </div>
                <div style={{fontFamily: serifFamily, fontSize: 66, marginTop: 14}}>{item.value}</div>
                <div style={{fontSize: 24, color: palette.inkSoft, marginTop: 10}}>{item.unit}</div>
              </Card>
            </Rise>
          ))}
        </div>
        <Rise delay={Math.round(dur * 0.75)}>
          <Note style={{marginTop: 40}}>a radian is a pure number, so it adds no unit</Note>
        </Rise>
      </div>
    </Stage>
  );
};

/* 10 ------------------------------------------------------------------ */
const Energy: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const rotation = 10 + frame * 0.3;

  return (
    <Stage kicker="Second route · energy">
      <div style={{flex: 1.1}}>
        <Rise>
          <Heading size={60}>The same answer from energy</Heading>
        </Rise>
        <Rise delay={Math.round(dur * 0.22)}>
          <Formula size={54} style={{marginTop: 34}}>
            K = ½ I ω²
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.42)}>
          <Formula size={54} color={palette.inkSoft} style={{marginTop: 16}}>
            dK/dt = I α ω
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.6)}>
          <Body size={29} style={{marginTop: 22}}>
            Torque equals moment of inertia times angular acceleration, so this is torque times omega again.
          </Body>
        </Rise>
        <Rise delay={Math.round(dur * 0.8)}>
          <Formula size={60} color={palette.indigo} style={{marginTop: 18}}>
            P = τ ω
          </Formula>
        </Rise>
      </div>
      <div style={{flex: 0.85, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={rotation} size={460} showRadius radiusLabel="r" showAngle angleLabel="θ" accent={palette.teal} />
      </div>
    </Stage>
  );
};

/* 11 ------------------------------------------------------------------ */
const Example: React.FC<SceneProps> = ({dur}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - Math.round(dur * 0.55), fps, config: {damping: 14, mass: 0.6}});

  return (
    <Stage kicker="Try it · a motor">
      <div style={{flex: 1}}>
        <Rise>
          <Heading size={60}>A motor in numbers</Heading>
        </Rise>
        <div style={{display: 'flex', gap: 26, marginTop: 42}}>
          <Rise delay={Math.round(dur * 0.2)}>
            <Card style={{width: 360}}>
              <div style={{fontSize: 22, color: palette.muted, fontWeight: 600}}>torque</div>
              <div style={{fontFamily: serifFamily, fontSize: 50, marginTop: 8, whiteSpace: 'nowrap'}}>40 N·m</div>
            </Card>
          </Rise>
          <Rise delay={Math.round(dur * 0.34)}>
            <Card style={{width: 400}}>
              <div style={{fontSize: 22, color: palette.muted, fontWeight: 600}}>angular velocity</div>
              <div style={{fontFamily: serifFamily, fontSize: 50, marginTop: 8, whiteSpace: 'nowrap'}}>100 rad/s</div>
            </Card>
          </Rise>
        </div>
        <Rise delay={Math.round(dur * 0.55)}>
          <div
            style={{
              marginTop: 44,
              backgroundColor: palette.amber,
              borderRadius: 24,
              padding: '24px 44px',
              width: 'fit-content',
              transform: `scale(${0.86 + 0.14 * pop})`,
            }}
          >
            <Formula size={80}>P = 40 × 100 = 4000 W</Formula>
            <div style={{fontSize: 26, color: palette.amberDeep, fontWeight: 600, marginTop: 6}}>four kilowatts</div>
          </div>
        </Rise>
      </div>
      <div style={{flex: 0.7, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={frame * 2.2} size={420} showRadius showForce radiusLabel="r" forceLabel="F" accent={palette.amberDeep} />
      </div>
    </Stage>
  );
};

/* 12 ------------------------------------------------------------------ */
const Recap: React.FC<SceneProps> = ({dur}) => {
  return (
    <Stage kicker="Recap">
      <div style={{flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <Rise>
          <Heading size={58}>Built from nothing</Heading>
        </Rise>
        <Rise delay={Math.round(dur * 0.2)}>
          <Formula size={48} color={palette.inkSoft} style={{marginTop: 34}}>
            work = torque × angle
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.36)}>
          <Formula size={48} color={palette.inkSoft} style={{marginTop: 12}}>
            power = work / time
          </Formula>
        </Rise>
        <Rise delay={Math.round(dur * 0.38)}>
          <div
            style={{
              marginTop: 30,
              backgroundColor: palette.amber,
              borderRadius: 24,
              padding: '22px 46px',
              width: 'fit-content',
            }}
          >
            <Formula size={88}>P = τ ω</Formula>
          </div>
        </Rise>
      </div>
      <div style={{flex: 0.8, display: 'flex', justifyContent: 'center'}}>
        <Disc rotation={140} size={440} showRadius showAngle radiusLabel="r" angleLabel="θ" accent={palette.indigo} />
      </div>
    </Stage>
  );
};

export const SCENES: Record<string, React.FC<SceneProps>> = {
  '01-title': Title,
  '02-work': Work,
  '03-power': Power,
  '04-linear': Linear,
  '05-circle': Circle,
  '06-torque': Torque,
  '07-work-rotation': WorkRotation,
  '08-derive': Derive,
  '09-units': Units,
  '10-energy': Energy,
  '11-example': Example,
  '12-recap': Recap,
};
