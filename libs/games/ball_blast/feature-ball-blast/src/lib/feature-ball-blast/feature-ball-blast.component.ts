import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'game-hub-feature-ball-blast',
  templateUrl: './feature-ball-blast.component.html',
  styleUrl: './feature-ball-blast.component.scss',
  standalone: false
})
export class FeatureBallBlastComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: false }) gameCanvas!: ElementRef<HTMLCanvasElement>;
  private gameInterval: any;
  private ballInterval: any;
  private bullets: Array<{ x: number; y: number }> = [];
  private balls: Array<{ x: number; y: number; size: number; number: number; speed: number; vy: number; color: string }> = [];
  private coins: Array<{ x: number; y: number; collected: boolean }> = [];
  private cannon: { x: number; width: number; height: number } = { x: 0, width: 50, height: 20 };
  protected score = 0;
  protected coinCount = 0;
  protected gameOver = false;

  ngAfterViewInit(): void {
    this.initializeGame();
  }

  private initializeGame(): void {
    const canvas = this.gameCanvas.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.88; // Matches the game-container height
    this.cannon.x = canvas.width / 2 - this.cannon.width / 2;
    this.startGame();
  }

  private startGame(): void {
    this.score = 0;
    this.coinCount = 0;
    this.bullets = [];
    this.balls = [];
    this.coins = [];
    this.gameOver = false;

    if (this.gameInterval) clearInterval(this.gameInterval);
    if (this.ballInterval) clearInterval(this.ballInterval);

    this.gameInterval = setInterval(() => this.updateGame(), 16); // ~60 FPS
    this.ballInterval = setInterval(() => this.spawnBall(), 100); // Ball spawn frequency
  }

  private updateGame(): void {
    if (!this.gameCanvas) return;

    const canvas = this.gameCanvas.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the cannon
    ctx.fillStyle = '#000';
    ctx.fillRect(this.cannon.x, canvas.height - this.cannon.height - 20, this.cannon.width, this.cannon.height);

    // Draw bullets
    ctx.fillStyle = 'red'; // Use a distinct color for bullets
    this.bullets.forEach((bullet, index) => {
      bullet.y -= 10; // Bullet speed
      ctx.fillRect(bullet.x, bullet.y, 5, 15); // Bullet size: 5px wide, 15px tall
      if (bullet.y + 15 < 0) this.bullets.splice(index, 1); // Remove bullets off-screen
    });

    // Draw balls
    this.balls.forEach((ball, index) => {
      ball.y += ball.vy;
      ball.vy += 0.2; // Simulates gravity

      if (ball.y + ball.size >= canvas.height) {
        ball.vy = -Math.abs(ball.vy) * 0.8; // Reverse direction and reduce speed for bounce
        ball.y = canvas.height - ball.size; // Prevent ball from sinking below ground
      }

      ctx.fillStyle = ball.color;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
      ctx.fill();

      // Draw ball number
      ctx.fillStyle = 'white';
      ctx.font = '14px Arial';
      ctx.fillText(`${ball.number}`, ball.x - 8, ball.y + 5);

      // Check collision with bullets
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

      // Check if ball hits cannon
      if (
        ball.y + ball.size >= canvas.height - this.cannon.height - 20 &&
        ball.x >= this.cannon.x &&
        ball.x <= this.cannon.x + this.cannon.width
      ) {
        this.endGame();
      }
    });

    // Draw coins
    ctx.fillStyle = 'gold';
    this.coins.forEach((coin, index) => {
      if (!coin.collected) {
        ctx.beginPath();
        ctx.arc(coin.x, coin.y, 10, 0, Math.PI * 2);
        ctx.fill();
      }

      // Check if coin is collected
      if (
        coin.y + 10 >= canvas.height - this.cannon.height - 20 &&
        coin.x >= this.cannon.x &&
        coin.x <= this.cannon.x + this.cannon.width
      ) {
        coin.collected = true;
        this.coinCount++;
        this.coins.splice(index, 1);
      }
    });

    // Display score and coins
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${this.score}`, 10, 30);
    ctx.fillText(`Coins: ${this.coinCount}`, 10, 60);

    // Handle game over screen
    if (this.gameOver) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'white';
      ctx.font = '40px Arial';
      ctx.fillText('Game Over!', canvas.width / 2 - 100, canvas.height / 2);
      ctx.fillText(`Final Score: ${this.score}`, canvas.width / 2 - 120, canvas.height / 2 + 50);
      clearInterval(this.gameInterval);
      clearInterval(this.ballInterval);
    }
  }

  private spawnBall(): void {
    const canvas = this.gameCanvas.nativeElement;
    const size = Math.random() * 20 + 30;
    const number = Math.ceil(size / 10);
    const speed = Math.random() * 1.5 + 0.5;
    const x = Math.random() * (canvas.width - size * 2) + size;
    const color = `hsl(${Math.random() * 360}, 70%, 50%)`; // Random ball color

    this.balls.push({ x, y: -size, size, number, speed, vy: 2, color });
  }

  private splitBall(ball: any, index: number): void {
    this.score += 10;
    const coinX = ball.x;

    // Drop a coin
    this.coins.push({ x: coinX, y: ball.y, collected: false });

    if (ball.size > 20) {
      this.balls.push({
        x: ball.x - ball.size / 2,
        y: ball.y,
        size: ball.size / 2,
        number: Math.ceil(ball.number / 2),
        speed: ball.speed,
        vy: -2,
        color: ball.color,
      });
      this.balls.push({
        x: ball.x + ball.size / 2,
        y: ball.y,
        size: ball.size / 2,
        number: Math.ceil(ball.number / 2),
        speed: ball.speed,
        vy: -2,
        color: ball.color,
      });
    }

    this.balls.splice(index, 1);
  }

  private endGame(): void {
    this.gameOver = true;
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    const canvas = this.gameCanvas.nativeElement;
    if (this.gameOver) return;

    switch (event.key) {
      case 'ArrowLeft':
        this.cannon.x = Math.max(this.cannon.x - 20, 0);
        break;
      case 'ArrowRight':
        this.cannon.x = Math.min(this.cannon.x + 20, canvas.width - this.cannon.width);
        break;
      case ' ':
        this.shootBullet();
        break;
    }
  }

  private shootBullet(): void {
    const canvas = this.gameCanvas.nativeElement;
    this.bullets.push({
      x: this.cannon.x + this.cannon.width / 2 - 2.5,
      y: canvas.height - this.cannon.height - 20,
    });
  }

  restartGame(): void {
    this.initializeGame();
  }

  ngOnDestroy(): void {
    clearInterval(this.gameInterval);
    clearInterval(this.ballInterval);
  }
}
