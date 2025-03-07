
![](https://i.imgur.com/JNCvW1J.png)

# 🏛️ Archimedes

> ***"Do not disturb my circles!"***  
> &nbsp; &nbsp; — *Archimedes, c. 212 BC*  

## Tournament-grade rollforward netcode for web games

🔮 **Whole-world rollforward:**  
Player inputs feel instant, and mispredictions correct themselves. It's all automatic, so you don't even have to think about lag when you're coding your game's logic.

🚚 **Transport-agnostic:**  
Default to free player-hosted games via [Sparrow RTC](https://github.com/benevolent-games/sparrow), but you can swap in webtransport or websockets if you want.

⛵ **Logic-agnostic:**  
We don't care if your game has fancy-schmancy ECS architecture, or a humble classical setup, whatever: just subclass `Simulator` and it's smooth sailing.

🛟 **Seamless reconnects:**  
Users *will* accidentally close their browser tab mid-game. Archimedes helps them pick up where they left off, no harm, no foul.

📦 **Npm package `@benev/archimedes`:**  
Archimedes isn't finished yet, it's under active development.

