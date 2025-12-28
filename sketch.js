let spriteSheetIdle, spriteSheetWalk, spriteSheetJump, spriteSheetAttack, spriteSheetTool;
let animationIdle = [];
let animationWalk = [];
let animationJump = [];
let animationAttack = [];
let animationTool = [];
let currentFrame = 0;

// 靜止動畫的圖片精靈資訊
const idleFrameCount = 9;
const idleFrameWidth = 958 / idleFrameCount;
const idleFrameHeight = 212;

// 走路動畫的圖片精靈資訊
const walkFrameCount = 9;
const walkFrameWidth = 1246 / walkFrameCount;
const walkFrameHeight = 198;

// 跳躍動畫的圖片精靈資訊
const jumpFrameCount = 10;
const jumpFrameWidth = 1365 / jumpFrameCount;
const jumpFrameHeight = 188;

// 攻擊動畫的圖片精靈資訊
const attackFrameCount = 6;
const attackFrameWidth = 1561 / attackFrameCount;
const attackFrameHeight = 155;

// 能量波動畫的圖片精靈資訊
const toolFrameCount = 5;
const toolFrameWidth = 740 / toolFrameCount;
const toolFrameHeight = 19;

// 新角色的圖片精靈資訊
const newCharFrameCount = 3;
const newCharFrameWidth = 241 / newCharFrameCount;
const newCharFrameHeight = 86;

// 新角色微笑動畫的圖片精靈資訊
const newCharSmileFrameCount = 10;
const newCharSmileFrameWidth = 615 / newCharSmileFrameCount;
const newCharSmileFrameHeight = 96;

// 新角色跌倒動畫的圖片精靈資訊
const newCharFallFrameCount = 4;
const newCharFallFrameWidth = 375 / newCharFallFrameCount;
const newCharFallFrameHeight = 83;

// 右邊新角色的圖片精靈資訊
const newChar2FrameCount = 3;
const newChar2FrameWidth = 238 / newChar2FrameCount;
const newChar2FrameHeight = 101;

// 右邊新角色接觸動畫的圖片精靈資訊
const newChar2TouchFrameCount = 4;
const newChar2TouchFrameWidth = 295 / newChar2TouchFrameCount;
const newChar2TouchFrameHeight = 115;

// 角色4的圖片精靈資訊
const newChar3FrameCount = 15;
const newChar3FrameWidth = 835 / newChar3FrameCount;
const newChar3FrameHeight = 85;

// 角色5的圖片精靈資訊
const newChar4FrameCount = 8;
const newChar4FrameWidth = 491 / newChar4FrameCount;
const newChar4FrameHeight = 70;

// 角色狀態
let x, y;
let speed = 5;
let direction = 1; // 1: 往右, -1: 往左
let isMoving = false;
let isJumping = false;
let isAttacking = false;
let attackFrame = 0;
let startY;
let jumpVelocity = 0;
const gravity = 0.8;

// 能量波
let projectiles = [];
let spriteSheetNewChar;
let animationNewChar = [];
let newCharX, newCharY;
let spriteSheetNewCharSmile;
let animationNewCharSmile = [];
let spriteSheetNewCharFall;
let animationNewCharFall = [];
let isChar2Fallen = false;
let char2FallFrame = 0;
let spriteSheetNewChar2;
let animationNewChar2 = [];
let newChar2X, newChar2Y;
let spriteSheetNewChar2Touch;
let animationNewChar2Touch = [];
let spriteSheetNewChar3;
let animationNewChar3 = [];
let newChar3X, newChar3Y;
let spriteSheetNewChar4;
let animationNewChar4 = [];
let newChar4X, newChar4Y;

// 測驗相關變數
let tableChar2, tableChar3, tableChar4; // 用於儲存 CSV 資料
let chatInput;
let activeChar = 0; // 0: 無, 2: 角色2, 3: 角色3, 4: 角色4

// 角色2 (newChar) 的測驗狀態
let questionsChar2 = [];
let currentQuestionIndexChar2 = 0;
let quizStateChar2 = "ASKING";
let feedbackTimerChar2 = 0;
let char2Dialog = "需要我解答嗎?";

// 角色3 (newChar2) 的測驗狀態
let questionsChar3 = [];
let currentQuestionIndexChar3 = 0;
let quizStateChar3 = "ASKING";
let feedbackTimerChar3 = 0;
let char3Dialog = "我也來考考你!";

// 角色4 (newChar3) 的測驗狀態
let questionsChar4 = [];
let currentQuestionIndexChar4 = 0;
let quizStateChar4 = "ASKING";
let feedbackTimerChar4 = 0;
let char4Dialog = "換我出題囉!";
let char5Dialog = "我是提示小幫手";

function preload() {
  // 預載入圖片精靈檔案
  spriteSheetIdle = loadImage('stop-all.png');
  spriteSheetWalk = loadImage('walk-all.png');
  spriteSheetJump = loadImage('jump-all.png');
  spriteSheetAttack = loadImage('attack-all.png');
  spriteSheetTool = loadImage('tool-all.png');
  spriteSheetNewChar = loadImage('2/stop/stop_2.png');
  spriteSheetNewCharSmile = loadImage('2/smile/smile_2.png'); // 載入微笑動畫
  spriteSheetNewCharFall = loadImage('2/fall_down/fall_down_2.png'); // 載入跌倒動畫
  spriteSheetNewChar2 = loadImage('3/stop/stop_3.png');
  spriteSheetNewChar2Touch = loadImage('3/touch/touch_3.png');
  spriteSheetNewChar3 = loadImage('4/stop/stop4_all.png');
  spriteSheetNewChar4 = loadImage('5/stop5/stop5_all.png');
  tableChar2 = loadTable('questions.csv', 'csv', 'header');
  tableChar3 = loadTable('questions_char3.csv', 'csv', 'header');
  tableChar4 = loadTable('questions_char4.csv', 'csv', 'header');
}

function setup() {
  // 建立一個全視窗的畫布
  createCanvas(windowWidth, windowHeight);
  x = width / 2;
  y = height / 2;
  startY = y;

  // 初始化新角色的固定位置，使其不受主角移動影響
  newCharX = x - 220;
  newCharY = startY + 60;

  // 初始化右邊新角色的固定位置
  newChar2X = x + 150;
  newChar2Y = startY + 60;

  // 初始化角色4的固定位置 (在角色3右邊)
  newChar3X = newChar2X + 220;
  newChar3Y = startY + 60;

  // 初始化角色5的固定位置 (在角色2左邊)
  newChar4X = newCharX - 220;
  newChar4Y = startY + 60;

  // 建立文字輸入框
  chatInput = createInput('');
  chatInput.position(-width, -height); // 先藏在畫面外
  chatInput.changed(handleInput); // 改為通用的輸入處理函式
  loadQuestions(); // 從 CSV 載入測驗題目

  // 從圖片精靈中切割出靜止動畫的每一格
  for (let i = 0; i < idleFrameCount; i++) {
    let img = spriteSheetIdle.get(i * idleFrameWidth, 0, idleFrameWidth, idleFrameHeight);
    animationIdle.push(img);
  }

  // 從圖片精靈中切割出走路動畫的每一格
  for (let i = 0; i < walkFrameCount; i++) {
    let img = spriteSheetWalk.get(i * walkFrameWidth, 0, walkFrameWidth, walkFrameHeight);
    animationWalk.push(img);
  }

  // 從圖片精靈中切割出跳躍動畫的每一格
  for (let i = 0; i < jumpFrameCount; i++) {
    let img = spriteSheetJump.get(i * jumpFrameWidth, 0, jumpFrameWidth, jumpFrameHeight);
    animationJump.push(img);
  }

  // 從圖片精靈中切割出攻擊動畫的每一格
  for (let i = 0; i < attackFrameCount; i++) {
    let img = spriteSheetAttack.get(i * attackFrameWidth, 0, attackFrameWidth, attackFrameHeight);
    animationAttack.push(img);
  }

  // 從圖片精靈中切割出能量波動畫的每一格
  for (let i = 0; i < toolFrameCount; i++) {
    let img = spriteSheetTool.get(i * toolFrameWidth, 0, toolFrameWidth, toolFrameHeight);
    animationTool.push(img);
  }

  // 從圖片精靈中切割出新角色的每一格
  for (let i = 0; i < newCharFrameCount; i++) {
    let img = spriteSheetNewChar.get(i * newCharFrameWidth, 0, newCharFrameWidth, newCharFrameHeight);
    animationNewChar.push(img);
  }

  // 從圖片精靈中切割出右邊新角色的每一格
  for (let i = 0; i < newChar2FrameCount; i++) {
    let img = spriteSheetNewChar2.get(i * newChar2FrameWidth, 0, newChar2FrameWidth, newChar2FrameHeight);
    animationNewChar2.push(img);
  }

  // 從圖片精靈中切割出右邊新角色接觸動畫的每一格
  for (let i = 0; i < newChar2TouchFrameCount; i++) {
    let img = spriteSheetNewChar2Touch.get(i * newChar2TouchFrameWidth, 0, newChar2TouchFrameWidth, newChar2TouchFrameHeight);
    animationNewChar2Touch.push(img);
  }

  // 從圖片精靈中切割出角色4的每一格
  for (let i = 0; i < newChar3FrameCount; i++) {
    let img = spriteSheetNewChar3.get(i * newChar3FrameWidth, 0, newChar3FrameWidth, newChar3FrameHeight);
    animationNewChar3.push(img);
  }

  // 從圖片精靈中切割出角色5的每一格
  for (let i = 0; i < newChar4FrameCount; i++) {
    let img = spriteSheetNewChar4.get(i * newChar4FrameWidth, 0, newChar4FrameWidth, newChar4FrameHeight);
    animationNewChar4.push(img);
  }

  // 從圖片精靈中切割出新角色微笑動畫的每一格
  for (let i = 0; i < newCharSmileFrameCount; i++) {
    let img = spriteSheetNewCharSmile.get(i * newCharSmileFrameWidth, 0, newCharSmileFrameWidth, newCharSmileFrameHeight);
    animationNewCharSmile.push(img);
  }

  // 從圖片精靈中切割出新角色跌倒動畫的每一格
  for (let i = 0; i < newCharFallFrameCount; i++) {
    let img = spriteSheetNewCharFall.get(i * newCharFallFrameWidth, 0, newCharFallFrameWidth, newCharFallFrameHeight);
    animationNewCharFall.push(img);
  }

  // 設定動畫播放速度
  frameRate(12);
}

function draw() {
  // 設定背景顏色
  background('#d6ccc2');

  imageMode(CENTER);

  let currentImage;

  // 決定角色當前應該顯示的圖片
  if (isAttacking) {
    // 處理攻擊動畫
    currentImage = animationAttack[attackFrame];
    attackFrame++;

    if (attackFrame >= attackFrameCount) {
      isAttacking = false;
      attackFrame = 0;
      // 攻擊動畫結束時，發射能量波
      let projectile = {
        x: x + (direction * 80), // 從角色前方發射
        y: y,
        direction: direction,
        speed: 15
      };
      projectiles.push(projectile);
    }
  } else if (isJumping) {
    // 處理跳躍動畫和位移
    y -= jumpVelocity;
    jumpVelocity -= gravity;

    let jumpFrameIndex = (jumpVelocity > 0) ? 4 : 8; // 簡化的上升/下降影格
    currentImage = animationJump[jumpFrameIndex];

    if (y >= startY) {
      y = startY;
      isJumping = false;
    }
  } else if (isMoving) {
    // 處理走路動畫和位移
    x += speed * direction;
    currentImage = animationWalk[currentFrame % animationWalk.length];
  } else {
    // 靜止狀態
    currentImage = animationIdle[currentFrame % animationIdle.length];
  }

  let isNearChar2 = dist(x, y, newCharX, newCharY) < 200;
  let isNearChar3 = dist(x, y, newChar2X, newChar2Y) < 200;
  let isNearChar4 = dist(x, y, newChar3X, newChar3Y) < 200;

  // 判斷目前與哪個角色互動
  activeChar = 0;
  if (isNearChar2 && !isChar2Fallen) {
    activeChar = 2;
  } else if (x > newChar2X) {
    // 當走到角色3右邊時，優先判斷角色4，角色3不再提問
    if (isNearChar4) activeChar = 4;
  } else if (isNearChar3) {
    activeChar = 3;
  }

  // 設定角色5的提示對話
  char5Dialog = "我是提示小幫手"; // 預設對話
  if (activeChar === 2 && questionsChar2.length > 0 && questionsChar2[currentQuestionIndexChar2].showHint) {
    char5Dialog = "提示: " + questionsChar2[currentQuestionIndexChar2].hint;
  } else if (activeChar === 3 && questionsChar3.length > 0 && questionsChar3[currentQuestionIndexChar3].showHint) {
    char5Dialog = "提示: " + questionsChar3[currentQuestionIndexChar3].hint;
  } else if (activeChar === 4 && questionsChar4.length > 0 && questionsChar4[currentQuestionIndexChar4].showHint) {
    char5Dialog = "提示: " + questionsChar4[currentQuestionIndexChar4].hint;
  }

  // 繪製角色5
  push();
  translate(newChar4X, newChar4Y);
  image(animationNewChar4[floor(currentFrame / 4) % animationNewChar4.length], 0, 0);
  
  // 顯示角色5的對話框 (提示文字)
  textSize(16);
  let textW5 = textWidth(char5Dialog);
  fill('#e9edc9');
  rectMode(CENTER);
  noStroke();
  rect(0, -65, textW5 + 20, 30, 5);
  fill(0);
  textAlign(CENTER, CENTER);
  text(char5Dialog, 0, -65);
  pop();

  // 當角色1靠近時，解除跌倒狀態，使其恢復正常
  if (isChar2Fallen && isNearChar2) {
    isChar2Fallen = false;
  }

  push();
  translate(newCharX, newCharY);

  if (isChar2Fallen) {
    // 顯示跌倒動畫
    let index = floor(char2FallFrame);
    image(animationNewCharFall[index], 0, 0);
    
    // 播放動畫直到最後一格停止 (只顯示一次)
    if (char2FallFrame < newCharFallFrameCount - 1) {
      char2FallFrame += 0.25; // 控制播放速度
    }
  } else if (isNearChar2) {
    // 靠近時：顯示微笑動畫和對話
    image(animationNewCharSmile[currentFrame % animationNewCharSmile.length], 0, 0);

    // --- 角色2 測驗邏輯 ---
    if (quizStateChar2 === "FEEDBACK") {
      // 顯示回饋訊息 (這裡直接使用 char2Dialog，因為在 handleInput 中已經設定了)
      if (millis() > feedbackTimerChar2) {
        quizStateChar2 = "ASKING";
        if (questionsChar2[currentQuestionIndexChar2].solved) {
          questionsChar2[currentQuestionIndexChar2].solved = false;
          currentQuestionIndexChar2 = (currentQuestionIndexChar2 + 1) % questionsChar2.length;
        }
      }
    } else if (questionsChar2.length > 0) {
      char2Dialog = questionsChar2[currentQuestionIndexChar2].question;
    }

    // 顯示對話文字
    textSize(16);
    let textW = textWidth(char2Dialog);
    fill('#e9edc9');
    rectMode(CENTER);
    noStroke();
    rect(0, -65, textW + 20, 30, 5);
    fill(0);
    textAlign(CENTER, CENTER);
    text(char2Dialog, 0, -65);
  } else {
    image(animationNewChar[currentFrame % animationNewChar.length], 0, 0);
  }
  pop();

  // --- 繪製角色1的作答框 ---
  if (activeChar !== 0) {
    const inputBoxY = y - 150;
    const labelText = "請作答：";
    
    textSize(16);
    const labelWidth = textWidth(labelText);
    const inputWidth = chatInput.width;
    const boxWidth = labelWidth + inputWidth + 30; // 加上左右邊距
    const boxHeight = 40;

    // 繪製黃色背景方塊
    fill('yellow');
    rectMode(CENTER);
    noStroke();
    rect(x, inputBoxY, boxWidth, boxHeight, 5);

    // 繪製文字 "請作答"
    textAlign(LEFT, CENTER);
    fill(0);
    text(labelText, x - boxWidth / 2 + 15, inputBoxY);

    // 定位輸入框
    chatInput.position(x - boxWidth / 2 + 15 + labelWidth, inputBoxY - chatInput.height / 2);
  } else {
    chatInput.position(-width, -height); // 移出畫面外
    // 重置對話
    if (!isChar2Fallen) char2Dialog = "需要我解答嗎?";
    char3Dialog = "我也來考考你!";
    char4Dialog = "換我出題囉!";
  }

  // 繪製右邊新角色
  push();
  translate(newChar2X, newChar2Y);
  push(); // 新增 push 以隔離翻轉效果，只針對圖片翻轉
  if (x > newChar2X) {
    scale(-1, 1); // 角色3原圖朝左，當角色1在右邊時，水平翻轉使其朝向右邊
  }

  if (isNearChar3) {
    image(animationNewChar2Touch[currentFrame % animationNewChar2Touch.length], 0, 0);
  } else {
    image(animationNewChar2[currentFrame % animationNewChar2.length], 0, 0);
  }
  pop(); // 結束翻轉效果，讓接下來的對話框不被翻轉

  if (isNearChar3) {
    
    // 只有當 activeChar 為 3 時才顯示對話與測驗 (避免在右側時顯示)
    if (activeChar === 3) {
      // --- 角色3 測驗邏輯 ---
      if (quizStateChar3 === "FEEDBACK") {
        if (millis() > feedbackTimerChar3) {
          quizStateChar3 = "ASKING";
          if (questionsChar3[currentQuestionIndexChar3].solved) {
            questionsChar3[currentQuestionIndexChar3].solved = false;
            currentQuestionIndexChar3 = (currentQuestionIndexChar3 + 1) % questionsChar3.length;
          }
        }
      } else if (questionsChar3.length > 0) {
        char3Dialog = questionsChar3[currentQuestionIndexChar3].question;
      }

      // 顯示對話文字
      textSize(16);
      let textW = textWidth(char3Dialog);
      fill('#e9edc9');
      rectMode(CENTER);
      noStroke();
      rect(0, -85, textW + 20, 30, 5);
      fill(0);
      textAlign(CENTER, CENTER);
      text(char3Dialog, 0, -85);
    }
  }
  pop();

  // 繪製角色4
  push();
  translate(newChar3X, newChar3Y);
  image(animationNewChar3[currentFrame % animationNewChar3.length], 0, 0);
  
  if (isNearChar4) {
    // 只有當 activeChar 為 4 時才顯示對話與測驗
    if (activeChar === 4) {
      // --- 角色4 測驗邏輯 ---
      if (quizStateChar4 === "FEEDBACK") {
        if (millis() > feedbackTimerChar4) {
          quizStateChar4 = "ASKING";
          if (questionsChar4[currentQuestionIndexChar4].solved) {
            questionsChar4[currentQuestionIndexChar4].solved = false;
            currentQuestionIndexChar4 = (currentQuestionIndexChar4 + 1) % questionsChar4.length;
          }
        }
      } else if (questionsChar4.length > 0) {
        char4Dialog = questionsChar4[currentQuestionIndexChar4].question;
      }

      // 顯示對話文字
      textSize(16);
      let textW = textWidth(char4Dialog);
      fill('#e9edc9');
      rectMode(CENTER);
      noStroke();
      rect(0, -65, textW + 20, 30, 5);
      fill(0);
      textAlign(CENTER, CENTER);
      text(char4Dialog, 0, -65);
    }
  }
  pop();

  // 更新和繪製所有能量波
  for (let i = projectiles.length - 1; i >= 0; i--) {
    let p = projectiles[i];
    p.x += p.speed * p.direction;

    // 檢查是否擊中角色2 (且角色2尚未跌倒)
    if (!isChar2Fallen && dist(p.x, p.y, newCharX, newCharY) < 80) {
      isChar2Fallen = true;
      char2FallFrame = 0;
      projectiles.splice(i, 1); // 移除能量波
      continue; // 跳過此能量波的後續繪製
    }

    push();
    translate(p.x, p.y);
    scale(p.direction, 1);
    image(animationTool[currentFrame % animationTool.length], 0, 0);
    pop();

    // 如果能量波超出畫面，則將其移除
    if (p.x > width + 100 || p.x < -100) {
      projectiles.splice(i, 1);
    }
  }

  // 繪製角色1 (主角色)，確保在最上層
  push(); // 保存當前的繪圖狀態
  translate(x, y); // 將原點移動到角色的位置
  scale(direction, 1); // 根據方向翻轉畫布
  image(currentImage, 0, 0);
  pop(); // 恢復到之前的繪圖狀態

  currentFrame++;
}

function keyPressed() {
  if (isAttacking || isJumping) return; // 攻擊或跳躍中不接受新指令

  if (keyCode === RIGHT_ARROW) {
    isMoving = true;
    direction = 1;
  } else if (keyCode === LEFT_ARROW) {
    isMoving = true;
    direction = -1;
  } else if (keyCode === UP_ARROW) {
    isJumping = true;
    jumpVelocity = 18; // 給予一個向上的初速度
  } else if (keyCode === DOWN_ARROW) { // 改為往下鍵發射
    isAttacking = true;
    isMoving = false;
    attackFrame = 0;
  }
}

function keyReleased() {
  if (keyCode === RIGHT_ARROW || keyCode === LEFT_ARROW) {
    isMoving = false;
  }
}

// 從 CSV 檔案載入題目
function loadQuestions() {
  // 建立一個輔助函式來讀取題目，這樣可以為每個角色產生獨立的題目陣列
  function createQuestionSet(sourceTable) {
    let qSet = [];
    for (let r = 0; r < sourceTable.getRowCount(); r++) {
      let row = sourceTable.getRow(r);
      qSet.push({
        question: row.getString('question'),
        answer: row.getString('answer'),
        correctMsg: row.getString('correct_msg'),
        wrongMsg: row.getString('wrong_msg'),
        hint: row.getString('hint'),
        solved: false,
        showHint: false
      });
    }
    return qSet;
  }

  questionsChar2 = createQuestionSet(tableChar2);
  questionsChar3 = createQuestionSet(tableChar3);
  questionsChar4 = createQuestionSet(tableChar4);
}

function handleInput() {
  const inputText = this.value();
  this.value('');

  // 根據目前互動的角色來處理答案
  if (activeChar === 2 && questionsChar2.length > 0 && quizStateChar2 === "ASKING") {
    checkAnswer(inputText, questionsChar2, currentQuestionIndexChar2, (msg) => { char2Dialog = msg; }, (state) => { quizStateChar2 = state; }, (timer) => { feedbackTimerChar2 = timer; });
  } else if (activeChar === 3 && questionsChar3.length > 0 && quizStateChar3 === "ASKING") {
    checkAnswer(inputText, questionsChar3, currentQuestionIndexChar3, (msg) => { char3Dialog = msg; }, (state) => { quizStateChar3 = state; }, (timer) => { feedbackTimerChar3 = timer; });
  } else if (activeChar === 4 && questionsChar4.length > 0 && quizStateChar4 === "ASKING") {
    checkAnswer(inputText, questionsChar4, currentQuestionIndexChar4, (msg) => { char4Dialog = msg; }, (state) => { quizStateChar4 = state; }, (timer) => { feedbackTimerChar4 = timer; });
  }
}

// 通用的檢查答案函式
function checkAnswer(input, qArray, index, setDialog, setState, setTimer) {
  let currentQ = qArray[index];
  if (input.trim() === currentQ.answer) {
    setDialog(currentQ.correctMsg);
    currentQ.solved = true;
    currentQ.showHint = false;
  } else {
    setDialog(currentQ.wrongMsg); // 移除這裡的提示，因為已經顯示在角色5了
    currentQ.solved = false;
    currentQ.showHint = true;
  }
  setState("FEEDBACK");
  setTimer(millis() + 2000);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
