import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function useExperienceMotion(root: RefObject<HTMLDivElement>) {
  useEffect(()=>{
    const media=gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)',()=>{
      const ctx=gsap.context(()=>{
        gsap.utils.toArray<HTMLElement>('.sx-reveal').forEach(el=>gsap.from(el,{y:50,opacity:0,duration:.85,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 92%',once:true},clearProps:'all'}));
        gsap.utils.toArray<HTMLElement>('.sx-text-reveal').forEach(el=>gsap.fromTo(el,{backgroundSize:'0% 100%'},{backgroundSize:'100% 100%',ease:'none',scrollTrigger:{trigger:el,start:'top 83%',end:'bottom 45%',scrub:1}}));
      },root);
      return ()=>ctx.revert();
    });
    // A navigation from /bot to a homepage anchor must wait for React's content.
    const timer=window.setTimeout(()=>{
      if(window.location.hash){document.getElementById(window.location.hash.slice(1))?.scrollIntoView({behavior:'instant'});}
      ScrollTrigger.refresh();
    },150);
    return()=>{media.revert();window.clearTimeout(timer);};
  },[root]);
}

