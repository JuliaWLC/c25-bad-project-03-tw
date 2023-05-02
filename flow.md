/
main page

### users login 
/userslogin
login page -> login
google login -> login

   /forgetpassword
forget password -> 新頁面 check email from database 

   /resetpassword 
-> if yes, send link to email —> 重設密碼 -> database check email 用hash新密碼取代舊密碼 -> login頁面
-> if no, alert 回去上一頁

   /createaccount
create new account -> 資料入db users table

### drivers login 
/driverslogin
login page -> login
google login -> login

   /forgetpassword
   forget password -> 新頁面 check email from database 

   /resetpassword 
   -> if yes, send link to email —> 重設密碼 -> database check email 用hash新密碼取代舊密碼 -> login頁面
   -> if no, alert 回去上一頁

   /createaccount
   create new account -> 資料入db drivers table
   optional: 車輛選擇 -> fetch db car_types table

### users personal page
/usersMain
顯示登入名稱 -> db users.name table
登出 (/)
建立訂單 
-> pick up district & address 從bd user_district user_address取出來
-> 其他資訊入db orders table
-> *animal type & amount 要可以加同減****
    /orderhistory

### drivers personal page
/driversMain
     /orderhistory


