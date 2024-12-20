import { AfterViewInit, Component, ElementRef, HostListener, inject, OnDestroy, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { GameState, SnakeFacadeService } from '@game-hub/shared/domain-logic';

@Component({
  selector: 'game-hub-feature-snake-master',
  standalone: false,
  templateUrl: './feature-snake-master.component.html',
  styleUrl: './feature-snake-master.component.scss',
})
export class FeatureSnakeMasterComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameBoard', { static: false }) gameBoard!: ElementRef<HTMLCanvasElement>;
  @ViewChild('animationBoard', { static: false }) animationBoard!: ElementRef<HTMLCanvasElement>;

  private readonly _destroy$ = new Subject<void>();
  protected GameState = GameState
  protected score = 0;
  #tileSize = 20;
  #snake: Array<{ type: string; x: number; y: number }> = [
    { type: 'head', x: 0, y: 0 },
    { type: 'body', x: -this.#tileSize, y: 0 },
  ];
  #food: { x: number; y: number } = this.#getRandomPosition();
  #direction: { x: number; y: number } = { x: 1, y: 0 };
  #gameInterval: any;
  #lastDirectionChangeTime = 0;
  #directionChangeDelay = 100;
  gameState: GameState = GameState.NotStarted;
  #gameSpeed = 200;
  #deathAnimation = false;
  #isSpeedBoosted = false;
  #heldKey: string | null = null;

  #headImg: HTMLImageElement = new Image();
  #bodyImg: HTMLImageElement = new Image();
  #foodImg: HTMLImageElement = new Image();
  #volcanoImg: HTMLImageElement = new Image();
  #blackholeImg: HTMLImageElement = new Image();
  #obstacles: Array<{ x: number; y: number; radius: number }> = [];
  #maxObstacles = 3;
  #snakeFacadeService = inject(SnakeFacadeService)
  constructor(
  ) {
    this.#headImg.src = 'assets/snake-master/snake-head.svg';
    this.#bodyImg.src = 'assets/snake-master/snake-body.svg';
    this.#foodImg.src = 'assets/snake-master/apple.svg';
    this.#volcanoImg.src = 'assets/snake-master/volcano.svg';
    this.#blackholeImg.src = 'assets/snake-master/blackhole.svg';
  }

  public ngAfterViewInit(): void {
    this.#resizeGameBoard();
    window.addEventListener('resize', this.#resizeGameBoard.bind(this));
    this.#startGame();
  }

  #startGame(): void {
    this.#resetGame();
    this.#setGameInterval();
  }

  #resetGame(): void {
    this.gameState = GameState.Started;
    this.#deathAnimation = false;
    this.#snake = [
      { type: 'head', x: 0, y: 0 },
      { type: 'body', x: -this.#tileSize, y: 0 },
    ];
    this.#direction = { x: 1, y: 0 };
    this.#food = this.#getRandomPosition();
    this.score = 0;
    this.#gameSpeed = 200;
    this.#lastDirectionChangeTime = 0;
    this.#generateObstacles();
  }

  protected restartGame(): void {
    this.#resetGame();
    clearInterval(this.#gameInterval);
    this.#setGameInterval();
  }

  #setGameInterval(): void {
    this.#gameInterval = setInterval(() => {
      if (this.gameState !== GameState.Paused) {
        this.#updateGame();
        this.#drawGame();
      }
    }, this.#gameSpeed);
  }

  #resizeGameBoard(): void {
    if (!this.gameBoard || !this.animationBoard) return;
    const canvas = this.gameBoard.nativeElement;
    const animationCanvas = this.animationBoard.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    animationCanvas.width = window.innerWidth;
    animationCanvas.height = window.innerHeight;
  }

  #updateGame(): void {
    const head = {
      x: this.#snake[0].x + this.#direction.x * this.#tileSize,
      y: this.#snake[0].y + this.#direction.y * this.#tileSize,
    };

    if (
      head.x < 0 ||
      head.y < 0 ||
      head.x >= this.gameBoard.nativeElement.width ||
      head.y >= this.gameBoard.nativeElement.height ||
      this.#snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
      this.#triggerDeathAnimation();
      return;
    }

    for (const obstacle of this.#obstacles) {
      const distX = head.x - obstacle.x;
      const distY = head.y - obstacle.y;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < obstacle.radius + this.#tileSize / 2) {
        this.#triggerDeathAnimation();
        return;
      }
    }

    this.#snake.unshift({ type: 'head', ...head });
    this.#snake[1].type = 'body';

    if (head.x === this.#food.x && head.y === this.#food.y) {
      this.#food = this.#getRandomPosition();
      this.#generateObstacles();
      this.score += 10;
      this.#increaseGameSpeed();
    } else {
      this.#snake.pop();
    }
  }

  #generateObstacles(): void {
    this.#obstacles = [];
    const numObstacles = Math.floor(Math.random() * (this.#maxObstacles)) + 2;
    while (this.#obstacles.length < numObstacles) {
      const size = Math.floor(Math.random() * 20) + 10;
      const position = this.#getRandomPosition({ x: this.#food.x, y: this.#food.y, radius: size });
      this.#obstacles.push({ x: position.x, y: position.y, radius: size });
    }
  }

  #triggerDeathAnimation(): void {
    this.gameState = GameState.GameOver;
    this.#deathAnimation = true;
    clearInterval(this.#gameInterval);
    if (this.score > 0) this.#postScoreToBackend();
    setTimeout(() => {
      this.#deathAnimation = false;
    }, 1000);
  }


  #increaseGameSpeed(): void {
    this.#gameSpeed = Math.max(50, this.#gameSpeed - 10);
    clearInterval(this.#gameInterval);
    this.#setGameInterval();
  }

  #drawGame(): void {
    if (!this.gameBoard) return;
    const canvas = this.gameBoard.nativeElement;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#f0f0f0';
    for (let x = 0; x < canvas.width; x += this.#tileSize) {
      for (let y = 0; y < canvas.height; y += this.#tileSize) {
        context.fillRect(x, y, this.#tileSize, this.#tileSize);
      }
    }

    context.strokeStyle = '#dcdcdc';
    context.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += this.#tileSize) {
      for (let y = 0; y < canvas.height; y += this.#tileSize) {
        context.strokeRect(x, y, this.#tileSize, this.#tileSize);
      }
    }

    context.fillStyle = 'rgba(0, 255, 0, 0.3)';
    let pathX = this.#snake[0].x;
    let pathY = this.#snake[0].y;

    while (true) {
      pathX += this.#direction.x * this.#tileSize;
      pathY += this.#direction.y * this.#tileSize;

      if (
        pathX < 0 || pathY < 0 ||
        pathX >= canvas.width || pathY >= canvas.height ||
        this.#snake.some((segment) => segment.x === pathX && segment.y === pathY)
      ) {
        break;
      }
      context.fillRect(pathX, pathY, this.#tileSize, this.#tileSize);
    }
    this.#obstacles.forEach((obstacle) => {
      const img = obstacle.radius > 15 ? this.#volcanoImg : this.#blackholeImg;
      context.drawImage(img, obstacle.x, obstacle.y, obstacle.radius * 2, obstacle.radius * 2); // Use size to scale the image
    });
    if (this.#deathAnimation) {
      return;
    }
    this.#snake.forEach((segment) => {
      const img = segment.type === 'head' ? this.#headImg : this.#bodyImg;
      if (segment.type === 'head') {
        context.save();
        context.translate(segment.x + this.#tileSize / 2, segment.y + this.#tileSize / 2);
        const angle = Math.atan2(this.#direction.y, this.#direction.x);
        context.rotate(angle);
        context.drawImage(img, -this.#tileSize / 2, -this.#tileSize / 2, this.#tileSize, this.#tileSize);
        context.restore();
      } else {
        context.drawImage(img, segment.x, segment.y, this.#tileSize, this.#tileSize);
      }
    });
    context.drawImage(this.#foodImg, this.#food.x, this.#food.y, this.#tileSize, this.#tileSize);
  }

  #getRandomPosition(exclude: { x: number; y: number; radius?: number } = {
    x: 0,
    y: 0
  }): { x: number; y: number } {
    if (!this.gameBoard) return { x: 0, y: 0 };
    const canvas = this.gameBoard.nativeElement;

    let x: number, y: number;
    do {
      x = Math.floor(Math.random() * (canvas.width / this.#tileSize)) * this.#tileSize;
      y = Math.floor(Math.random() * (canvas.height / this.#tileSize)) * this.#tileSize;
    } while (this.#isTooCloseToFood(x, y, exclude));

    return { x, y };
  }

  #isTooCloseToFood(x: number, y: number, exclude: { x: number; y: number; radius?: number }): boolean {
    const foodDistance = Math.sqrt(Math.pow(x - this.#food.x, 2) + Math.pow(y - this.#food.y, 2));
    if (foodDistance < this.#tileSize * 3) return true;  // Too close to food

    if (exclude.radius) {
      const obstacleDistance = Math.sqrt(Math.pow(x - exclude.x, 2) + Math.pow(y - exclude.y, 2));
      if (obstacleDistance < (exclude.radius + this.#tileSize * 2)) return true; // Too close to another obstacle
    }

    return false;
  }

  #getCurrentDirectionKey(): string {
    if (this.#direction.x === 1) return 'ArrowRight';
    if (this.#direction.x === -1) return 'ArrowLeft';
    if (this.#direction.y === 1) return 'ArrowDown';
    return 'ArrowUp';
  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeyDown(event: KeyboardEvent): void {
    if (event.key === ' ') {
      this.togglePause();
      return;
    }
    if (this.gameState === GameState.Paused || this.gameState === GameState.GameOver) return;

    const currentTime = new Date().getTime();
    if (currentTime - this.#lastDirectionChangeTime < this.#directionChangeDelay) {
      return;
    }

    const oppositeDirections: Record<string, string> = {
      ArrowUp: 'ArrowDown',
      ArrowDown: 'ArrowUp',
      ArrowLeft: 'ArrowRight',
      ArrowRight: 'ArrowLeft',
    };

    if (
      Object.keys(oppositeDirections).includes(event.key) &&
      event.key !== oppositeDirections[this.#getCurrentDirectionKey()]
    ) {
      switch (event.key) {
        case 'ArrowUp':
          if (this.#direction.y === 0) this.#direction = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (this.#direction.y === 0) this.#direction = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (this.#direction.x === 0) this.#direction = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (this.#direction.x === 0) this.#direction = { x: 1, y: 0 };
          break;
      }
      this.#lastDirectionChangeTime = currentTime;
      this.#heldKey = event.key; // Track the key being held
      this.#enableSpeedBoost(event.key);
    }
  }
  @HostListener('window:keyup', ['$event'])
  protected handleKeyUp(event: KeyboardEvent): void {
    if (event.key === this.#heldKey) {
      this.#disableSpeedBoost();
      this.#heldKey = null;
    }
  }

  #enableSpeedBoost(key: string): void {
    if (this.#isSpeedBoosted || key !== this.#getCurrentDirectionKey()) return;

    this.#isSpeedBoosted = true;
    const boostedSpeed = Math.min(50, this.#gameSpeed / 2);
    clearInterval(this.#gameInterval);
    this.#gameInterval = setInterval(() => {
      if (this.gameState !== GameState.Paused) {
        this.#updateGame();
        this.#drawGame();
      }
    }, boostedSpeed);
  }

  #disableSpeedBoost(): void {
    if (!this.#isSpeedBoosted) return;

    this.#isSpeedBoosted = false;
    clearInterval(this.#gameInterval);
    this.#setGameInterval();
  }

  protected togglePause(): void {
    if (this.gameState === GameState.GameOver) return;
    this.gameState = this.gameState === GameState.Paused ? GameState.Started : GameState.Paused;
    if (this.gameState === GameState.Paused) {
      clearInterval(this.#gameInterval);
    } else {
      this.#setGameInterval();
    }
  }

  #postScoreToBackend(): void {
    this.#snakeFacadeService.createScore(this.score)
      .pipe(takeUntil(this._destroy$))
      .subscribe({
        next: (res) => {
          console.log('Score posted successfully', res.rank);
        },
        error: (error) => {
          console.error('Error posting score', error);
        },
        complete: () => {
          console.log('Score posting complete');
        }
      });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
    clearInterval(this.#gameInterval);
  }
}
