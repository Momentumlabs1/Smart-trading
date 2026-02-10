import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="section-container max-w-2xl mx-auto py-24 sm:py-32 px-4">
        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          <p className="text-2xl sm:text-3xl font-display font-bold text-foreground">
            Okey dann komm mal mit!
          </p>

          <p>
            Mein Name kennst du ja bereits.
          </p>

          <p>
            Ich wohne in Linz, hergekommen bin ich damals als Flüchtling
            und hatte dadurch einen Kaltstart ins Leben.
          </p>

          <p>
            Durch unsere damalige Situation hab ich den Wert von Geld kennengelernt,
            weshalb ich mich schon früh selbständig machte
            weil ich dachte dass das der Ausweg ist.
          </p>

          <p>
            Nach Jahren in der Gastro, Shisha Bar... verstand ich aber irgendwann,
            dass ich niemals frei sein werde wenn ich meine begrenzte Lebenszeit
            gegen Geld eintausche das durch die großen Player
            gleichzeitig immer mehr an Wert verliert.
          </p>

          <p>
            Das Warum war nun klar, nur noch nicht das Wie,
            bis ich durch meinen damaligen Mentor auf Trading gestoßen bin.
          </p>

          <p>
            Das Verständnis darüber dass ich mit genug Wissen, Zeit
            und dem richtigen Plan das Doppelte, Fünf- oder Zehnfache
            im Monat verdienen kann wie ein Arzt, hat mich nicht losgelassen.
          </p>

          <p>
            Also startete ich meine 10-jährige Trading-Reise
            die mich durch viele Höhen und Tiefen geführt hat
            bis ich durch das richtige System und Beharrlichkeit
            profitabel geworden bin und nun mein Geld für mich arbeiten lasse.
          </p>

          <p>
            Und genau diese Werte vermitteln wir hier auf Smart Trading.
          </p>

          <p className="text-foreground font-medium">
            Aber jetzt genug von mir.
          </p>

          <p className="text-foreground font-medium">
            Du bist wieder an der Reihe!
          </p>

          <p className="text-foreground font-medium">
            Als erstes würde mich interessieren:
          </p>

          <p className="text-xl font-display font-bold text-primary">
            Fängst du gerade erst mit Trading an?
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
