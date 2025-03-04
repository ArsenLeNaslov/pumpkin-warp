export default function loadAssets() {
  loadPedit("pumpkin", "sprites/pumpkin.pedit");
  loadPedit("ghost", "sprites/ghost.pedit");
  loadPedit("ghost_block", "sprites/ghost_block.pedit");
  loadSprite("castle", "sprites/castle.png");
  loadPedit("rock", "sprites/rock.pedit");
  loadPedit("portalh", "sprites/portalh.pedit");
  loadSound("hit", "sounds/hit.mp3");
  loadSound("mystic", "sounds/mystic.mp3");
  loadSound("Syndrome_by_z3er0", "sounds/Syndrome_by_z3er0.wav");
  const music = play("Syndrome_by_z3er0", { loop: true, volume: 0.5 });
  return {
  }
}