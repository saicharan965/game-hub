import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { GameState } from '@game-hub/shared/domain-logic';

@Component({
  selector: 'game-hub-feature-ball-blast',
  templateUrl: './feature-ball-blast.component.html',
  styleUrls: ['./feature-ball-blast.component.scss'],
  standalone: false,
})
export class FeatureBallBlastComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;

  private gameInterval!: number;
  private ballInterval!: number;
  private shootInterval?: number;

  private cannon = { x: 0, width: 50, height: 20, speed: 5 };
  private bullets: Array<{ x: number; y: number }> = [];
  private balls: Array<{ x: number; y: number; size: number; number: number; color: string; vy: number }> = [];
  private coins: Array<{ x: number; y: number; collected: boolean }> = [];

  protected isGameOver = false;
  protected score = 0;
  private coinsCollected = 0;
  protected gameState = GameState.NotStarted
  protected GameState = GameState;
  private keysPressed: Record<string, boolean> = {};

  ngAfterViewInit(): void {
    this.initializeGame();
  }

  private initializeGame(): void {
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.88; // Match visible area
    this.ctx = canvas.getContext('2d')!;
    this.cannon.x = canvas.width / 2 - this.cannon.width / 2;

    this.startGame();
  }

  private startGame(): void {
    this.score = 0;
    this.coinsCollected = 0;
    this.isGameOver = false;
    this.bullets = [];
    this.balls = [];
    this.coins = [];
    this.keysPressed = {};

    clearInterval(this.gameInterval);
    clearInterval(this.ballInterval);
    clearInterval(this.shootInterval);

    this.gameInterval = setInterval(() => this.updateGame(), 16); // ~60 FPS
    this.ballInterval = setInterval(() => this.spawnBall(), 2500); // Ball spawn frequency
  }

  private updateGame(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.handleCannonMovement();
    this.drawCannon();
    this.drawBullets();
    this.drawBalls();
    this.drawCoins();
    this.displayScore();

    if (this.isGameOver) {
      this.endGame();
    }
  }

  private handleCannonMovement(): void {
    const canvas = this.gameCanvas.nativeElement;
    if (this.keysPressed['ArrowLeft']) {
      this.cannon.x = Math.max(this.cannon.x - this.cannon.speed, 0);
    }
    if (this.keysPressed['ArrowRight']) {
      this.cannon.x = Math.min(this.cannon.x + this.cannon.speed, canvas.width - this.cannon.width);
    }
  }

  private drawCannon(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx.fillStyle = 'black';
    this.ctx.fillRect(this.cannon.x, canvas.height - this.cannon.height - 20, this.cannon.width, this.cannon.height);
  }

  private drawBullets(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.ctx.fillStyle = 'red'; // Bullet color
    this.bullets.forEach((bullet, index) => {
      bullet.y -= 10; // Move bullet upwards
      this.ctx.fillRect(bullet.x, bullet.y, 5, 10); // Bullet size

      if (bullet.y < 0) this.bullets.splice(index, 1); // Remove off-screen bullets
    });
  }

  private drawBalls(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.balls.forEach((ball, index) => {
      ball.y += ball.vy;
      ball.vy += 0.2; // Gravity effect

      // Bounce off the ground
      if (ball.y + ball.size >= canvas.height) {
        ball.vy = -Math.abs(ball.vy) * 0.8; // Bounce up
        ball.y = canvas.height - ball.size; // Reset position
      }

      // Draw the ball
      this.ctx.fillStyle = ball.color;
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
      this.ctx.fill();

      // Draw the number
      this.ctx.fillStyle = 'white';
      this.ctx.font = '14px Arial';
      this.ctx.fillText(`${ball.number}`, ball.x - 8, ball.y + 5);

      // Check for collisions with bullets
      this.bullets.forEach((bullet, bulletIndex) => {
        const dist = Math.hypot(bullet.x - ball.x, bullet.y - ball.y);
        if (dist < ball.size) {
          ball.number--;
          this.bullets.splice(bulletIndex, 1);
          if (ball.number <= 0) {
            this.splitBall(ball, index);
          }
        }
      });

      // Check if ball hits the cannon
      if (
        ball.y + ball.size >= canvas.height - this.cannon.height - 20 &&
        ball.x >= this.cannon.x &&
        ball.x <= this.cannon.x + this.cannon.width
      ) {
        this.isGameOver = true;
      }
    });
  }

  private drawCoins(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.coins.forEach((coin, index) => {
      if (!coin.collected) {
        this.ctx.fillStyle = 'gold';
        this.ctx.beginPath();
        this.ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        this.ctx.fill();
      }

      // Check if coin is collected
      if (
        coin.y + 10 >= canvas.height - this.cannon.height - 20 &&
        coin.x >= this.cannon.x &&
        coin.x <= this.cannon.x + this.cannon.width
      ) {
        coin.collected = true;
        this.coinsCollected++;
        this.coins.splice(index, 1);
      }
    });
  }

  private spawnBall(): void {
    const canvas = this.gameCanvas.nativeElement;
    const size = Math.random() * 20 + 30; // Ball size
    const number = Math.ceil(size / 10); // Number on the ball
    const x = Math.random() * (canvas.width - size * 2) + size; // Random X position
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`; // Random color

    this.balls.push({ x, y: -size, size, number, color, vy: 2 });
  }

  private splitBall(ball: any, index: number): void {
    this.score += 10;

    // Drop a coin
    this.coins.push({ x: ball.x, y: ball.y, collected: false });

    // Create smaller balls if applicable
    if (ball.size > 20) {
      const newSize = ball.size / 2;
      this.balls.push({ x: ball.x - newSize, y: ball.y, size: newSize, number: Math.ceil(ball.number / 2), color: ball.color, vy: -2 });
      this.balls.push({ x: ball.x + newSize, y: ball.y, size: newSize, number: Math.ceil(ball.number / 2), color: ball.color, vy: -2 });
    }

    // Remove the original ball
    this.balls.splice(index, 1);
  }

  private displayScore(): void {
    this.ctx.fillStyle = 'black';
    this.ctx.font = '20px Arial';
    this.ctx.fillText(`Score: ${this.score}`, 10, 30);
    this.ctx.fillText(`Coins: ${this.coinsCollected}`, 10, 60);
  }

  private endGame(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.ballInterval);

    const canvas = this.gameCanvas.nativeElement;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    this.ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    this.keysPressed[event.key] = true;

    if (event.key === ' ' && !this.shootInterval) {
      this.shootInterval = setInterval(() => this.shootBullet(), 200); // Shoot every 200ms
    }
  }

  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent): void {
    this.keysPressed[event.key] = false;

    if (event.key === ' ' && this.shootInterval) {
      clearInterval(this.shootInterval);
      this.shootInterval = undefined;
    }
  }

  private shootBullet(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.bullets.push({
      x: this.cannon.x + this.cannon.width / 2 - 2.5,
      y: canvas.height - this.cannon.height - 20,
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.ballInterval);
    clearInterval(this.shootInterval);
  }
}
