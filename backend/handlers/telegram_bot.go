package handlers

// import (
// 	"log"

// 	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
// )

// func StartTelegramBot(token string) {
// 	bot, err := tgbotapi.NewBotAPI(token)
// 	if err != nil {
// 		log.Panic(err)
// 	}

// 	bot.Debug = true

// 	log.Printf("Authorized on account %s", bot.Self.UserName)

// 	u := tgbotapi.NewUpdate(0)
// 	u.Timeout = 60

// 	updates, err := bot.GetUpdatesChan(u)

// 	for update := range updates {
// 		if update.Message == nil { // ignore any non-Message Updates
// 			continue
// 		}

// 		log.Printf("[%s] %s", update.Message.From.UserName, update.Message.Text)

// 		msg := tgbotapi.NewMessage(update.Message.Chat.ID, "")
// 		switch update.Message.Text {
// 		case "/start":
// 			msg.Text = "Welcome to Car Registration Bot!\nUse /register to register your car or /login to login."
// 		case "/register":
// 			msg.Text = "Please use the React Native app for registration. Telegram registration is not implemented yet."
// 		case "/login":
// 			msg.Text = "Please use the React Native app for login. Telegram login is not implemented yet."
// 		default:
// 			msg.Text = "I don't know that command. Use /start to see available commands."
// 		}

// 		if _, err := bot.Send(msg); err != nil {
// 			log.Panic(err)
// 		}
// 	}
// }
