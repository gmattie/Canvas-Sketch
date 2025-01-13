import { TextureLoader, Vector2, Group } from "three";
import StoneTile from "./components/StoneTile";
import Scene from "./components/Scene";
import { Colors } from "./support/constants";
import { getRandomBasicColor } from "./support/utils";
import "./style.css";

const init = () => {
  const stoneTexture = new TextureLoader().load("./textures/Stone.webp");

  const stoneTile1 = new StoneTile(
    stoneTexture,
    getRandomBasicColor(),
    new Vector2(-1, 1)
  );
  const stoneTile2 = new StoneTile(
    stoneTexture,
    getRandomBasicColor(),
    new Vector2(1, 1)
  );
  const stoneTile3 = new StoneTile(
    stoneTexture,
    getRandomBasicColor(),
    new Vector2(-1, -1)
  );
  const stoneTile4 = new StoneTile(
    stoneTexture,
    getRandomBasicColor(),
    new Vector2(1, -1)
  );

  const stoneTilesGroup = new Group();
  stoneTilesGroup.add(stoneTile1);
  stoneTilesGroup.add(stoneTile2);
  stoneTilesGroup.add(stoneTile3);
  stoneTilesGroup.add(stoneTile4);

  const scene = new Scene(Colors.BACKGROUND);
  scene.addMeshGroup(stoneTilesGroup);
  scene.render();
};

init();
