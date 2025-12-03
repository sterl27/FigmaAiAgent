import BeatGeneratorSimple, { type BeatData } from '@/components/music/BeatGeneratorSimple';

export default function TestBeatGenerator() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Enhanced Beat Generator Test
      </h1>
      <BeatGeneratorSimple onBeatGenerated={(beat: BeatData) => console.log('Beat generated:', beat)} />
    </div>
  );
}
