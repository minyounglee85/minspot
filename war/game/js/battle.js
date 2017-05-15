//전투 코드 시작
        console.log(playerMoney);
        console.log(monster);
        
        var playerAttackRating;
        var monsterAttackRating;
        var monster = statusSlime;
        
        var massage = new Label ('');
        massage.color = 'white';
        massage.moveTo (10, 10);

        var Battle = new Scene (320, 320);
        
        var BattleMenuCursor = new Sprite(300, 20);
        BattleMenuCursor.backgroundColor = 'black';
        BattleMenuCursor.moveTo (10, 175);
         
        var mon = new Sprite (32, 32);
        mon.image = game.assets[monster[5]];
        mon.frame = monster[6];
        mon.moveTo (150, 100);
        mon.scale (2, 2);

        var Battleattack = new Label ('Attack');
        Battleattack.color = 'white';
        Battleattack.moveTo (10, 180);
        var Battlemagic = new Label ('Magic');
        Battlemagic.color = 'white';
        Battlemagic.moveTo (10, 210);
        var Battleesc = new Label ('Run');
        Battleesc.color = 'white';
        Battleesc.moveTo (10, 240);
          
        var monsterHp = monster[1];

        Battle.on ('enterframe', function() {
           if (BattleMenuCursor.y < 235 && game.input.down) {
             BattleMenuCursor.y += 30;
             game.input.down = false;
           } else if (BattleMenuCursor.y > 175 && game.input.up) {
             BattleMenuCursor.y -= 30;
             game.input.up = false;
           }
          });

        //키보드 조작 설정
        Battle.on ('abuttondown', function() {
           if (BattleMenuCursor.y == 175) {
               
        	   //공격 명중률 설정(랜덤숫자 + 민첩성)
        	   playerAttackRating = Math.floor(Math.random() * 100) + playerDex;
               monsterAttackRating = Math.floor(Math.random() * 100);
               console.log(playerAttackRating);
               console.log(monsterAttackRating);
               
               //플레이어가 적 명중
               if (playerAttackRating >= monsterAttackRating) {
                 massage.text = 'Hit ' + monster[0] + ' ' + playerStr + 'Damage';
                 monsterHp -= playerStr;
                 mon.tl.scaleBy (0.5, 5)
                       .scaleBy (2, 5);
                 
               //몬스터가 플레이어 명중
               } else {
                 massage.text = 'Counter ' + monster[0] + ' ' + monster[2] + 'Damage';
                 playerHp -= monster[2];
                 Battle.tl.moveBy (0, -40, 5)
                          .moveBy (0, 40, 5);
               }
           } else if (BattleMenuCursor.y == 205) {
              if (inventory.indexOf(3) == -1) {
                massage.text = 'You have no Magic';
              } else if (playerMp <= 0) {
                massage.text = 'No MP';
              } else {
                massage.text = 'Fire ball 5 Damage';
                monsterHp -= 5;
                playerMp -= 2;
              }
           } else if (BattleMenuCursor.y == 235) {
             game.popScene (Battle);
           }
         });
        
         //터치 조작 설정
         Battleattack.on ('touchstart', function() {
               playerAttackRating = Math.floor(Math.random() * 100) + playerDex;
               monsterAttackRating = Math.floor(Math.random() * 100);
               console.log(playerAttackRating);
               console.log(monsterAttackRating);
               if (playerAttackRating >= monsterAttackRating) {
                 massage.text = 'Hit ' + monster[0] + ' ' + playerStr + 'Damage';
                 monsterHp -= playerStr;
                 mon.tl.scaleBy (0.5, 5)
                       .scaleBy (2, 5);                  
               } else {
                 massage.text = 'Counter ' + monster[0] + ' ' + monster[2] + 'Damage';
                 playerHp -= monster[2];
                 Battle.tl.moveBy (0, -40, 5)
                        .moveBy (0, 40, 5);
               }
         });
        Battlemagic.on ('touchstart', function() {
            if (inventory.indexOf(3) == -1) {
                massage.text = 'You have no magic';
              } else if (playerMp <= 0) {
                massage.text = 'No MP';
              } else {
                massage.text = 'Fire ball 5 Damage';
                monsterHp -= 5;
                playerMp -= 2;
              }
         });
        Battleesc.on ('touchstart', function() {
           game.popScene (Battle);
         });

        //전투 종료 업데이트 및 메세지
        Battle.on ('enterframe', function() {
          if (monsterHp <= 0) {
            playerExp += monster[3];
            playerMoney += monster[4];
            monsterHp = monster[1];
            say(monster[0] + ' is dead <br>' + monster[4] + ' + Gold <br>' + monster[4] + ' + Exp');
            game.popScene (Battle);
          }
          if (playerHp <= 0) {
            say ('Defeat');
            game.popScene (Battle);
          }
         });
        
        Battle.addChild(mon);
        Battle.addChild(BattleMenuCursor);
        Battle.addChild(Battleattack);
        Battle.addChild(Battlemagic);
        Battle.addChild(Battleesc);
        Battle.addChild(massage);
        Battle.backgroundColor = 'rgba(0, 0, 0, 0.3)';
        //전투코드 끝