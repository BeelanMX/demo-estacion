#include <lmic.h>
#include <hal/hal.h>
#include <SPI.h>
#include <DMD2.h>
#include <fonts/SystemFont5x7.h>
#include <fonts/Arial14.h>

// You can change to a smaller font (two lines) by commenting this line,
// and uncommenting the line after it:
//const uint8_t *FONT = Arial14;
const uint8_t *FONT = SystemFont5x7;
const char *MESSAGE = "Parada 2do anillo ";

const char *next = MESSAGE;
//SoftDMD dmd(DISPLAYS_WIDE,DISPLAYS_HIGH,DMD_PIN_NOE,DMD_PIN_A,DMD_PIN_B,DMD_PIN_SCK,DMD_PIN_CLK,DMD_PIN_R); // DMD controls the entire display
SoftDMD dmd(1, 1, A0, A1, A2, A3, 8, 7);
DMD_TextBox box(dmd);  // "box" provides a text box to automatically write to/scroll the display

// This EUI must be in little-endian format, so least-significant-byte
// first. When copying an EUI from ttnctl output, this means to reverse
// the bytes. For TTN issued EUIs the last bytes should be 0xD5, 0xB3,
// 0x70. 00 00 00 00 00 00 0A E2
static const u1_t PROGMEM APPEUI[8] = {0x45,0x23,0x21,0x43,0x75,0x56,0x34,0x12};
void os_getArtEui (u1_t* buf) {
  memcpy_P(buf, APPEUI, 8);
}

// This should also be in little endian format, see above.
static const u1_t PROGMEM DEVEUI[8] = {0x56,0x43,0x65,0x87,0x09,0x89,0x67,0x45};
void os_getDevEui (u1_t* buf) {
  memcpy_P(buf, DEVEUI, 8);
}
// This key should be in big endian format (or, since it is not really a
// number but a block of memory, endianness does not really apply). In
// practice, a key taken from ttnctl can be copied as-is.
// The key shown here is the semtech default key.
static const u1_t PROGMEM APPKEY[16] = {0x87,0x67,0x89,0xFF,0xF5,0x67,0x82,0x76,0x54,0x56,0x78,0x72,0x61,0x56,0x78,0x87};
void os_getDevKey (u1_t* buf) {
  memcpy_P(buf, APPKEY, 16);
}

static uint8_t mydata[] = "ping";
String datarx="The Inventors House";
static osjob_t sendjob;

// Schedule TX every this many seconds (might become longer due to duty
// cycle limitations).
const unsigned TX_INTERVAL = 10;
// Pin mapping
const lmic_pinmap lmic_pins = {
  .nss = 10,
  .rxtx = LMIC_UNUSED_PIN,
  .rst = 5,
  .dio = {2, 3, 4},
};

void onEvent (ev_t ev) {
  Serial.print(os_getTime());
  Serial.print(": ");
  switch (ev) {
    case EV_SCAN_TIMEOUT:
      Serial.println(F("EV_SCAN_TIMEOUT"));
      break;
    case EV_BEACON_FOUND:
      Serial.println(F("EV_BEACON_FOUND"));
      break;
    case EV_BEACON_MISSED:
      Serial.println(F("EV_BEACON_MISSED"));
      break;
    case EV_BEACON_TRACKED:
      Serial.println(F("EV_BEACON_TRACKED"));
      break;
    case EV_JOINING:
      Serial.println(F("EV_JOINING"));
      break;
    case EV_JOINED:
      Serial.println(F("EV_JOINED"));
      LMIC_setLinkCheckMode(0);
      break;
    case EV_RFU1:
      Serial.println(F("EV_RFU1"));
      break;
    case EV_JOIN_FAILED:
      Serial.println(F("EV_JOIN_FAILED"));
      break;
    case EV_REJOIN_FAILED:
      Serial.println(F("EV_REJOIN_FAILED"));
      break;
    case EV_TXCOMPLETE:
      Serial.println(F("EV_TXCOMPLETE (includes waiting for RX windows)"));
      if (LMIC.txrxFlags & TXRX_ACK)
        Serial.println(F("Received ack"));
      if (LMIC.dataLen) {
        Serial.print(F("Received "));
        Serial.print(LMIC.dataLen);
        Serial.println(F(" bytes of payload"));
        Serial.print(F("Data: "));
        Serial.write(LMIC.frame+LMIC.dataBeg, LMIC.dataLen);
        Serial.println();

        uint8_t data[LMIC.dataLen];
        memcpy(&data, &(LMIC.frame + LMIC.dataBeg)[0], LMIC.dataLen);
        box.clear();
        for (int i = 0; i < LMIC.dataLen; i++) {
            //Serial.println(char(data[i]));
            box.print(char(data[i]));
            delay(200);
        }


      }
      // Schedule next transmission
      os_setTimedCallback(&sendjob, os_getTime() + sec2osticks(TX_INTERVAL), do_send);
      break;
    case EV_LOST_TSYNC:
      Serial.println(F("EV_LOST_TSYNC"));
      break;
    case EV_RESET:
      Serial.println(F("EV_RESET"));
      break;
    case EV_RXCOMPLETE:
      // data received in ping slot
      Serial.println(F("EV_RXCOMPLETE"));
      break;
    case EV_LINK_DEAD:
      Serial.println(F("EV_LINK_DEAD"));
      break;
    case EV_LINK_ALIVE:
      Serial.println(F("EV_LINK_ALIVE"));
      break;
    default:
      Serial.println(F("Unknown event"));
      break;
  }
}

void do_send(osjob_t* j) {
  // Check if there is not a current TX/RX job running
  if (LMIC.opmode & OP_TXRXPEND) {
    Serial.println(F("OP_TXRXPEND, not sending"));
  }
     else {
      LMIC_setTxData2(1, mydata, sizeof(mydata)-1, 0);
      Serial.println(F("Packet queued"));
    }
  // Next TX is scheduled after TX_COMPLETE event.
}

/*--------------------------------------------------------------------------------------
  setup
  Called by the Arduino architecture before the main loop begins
--------------------------------------------------------------------------------------*/
void setup(void)
{
  Serial.begin(9600);
  Serial.println(F("Starting..."));

  dmd.setBrightness(255);
  dmd.selectFont(FONT);
  dmd.begin();

  // LMIC init
  os_init();
  // Reset the MAC state. Session and pending data transfers will be discarded.
  LMIC_reset();

      //Configuration for SubBand 7
      for (int channel=0; channel<72; ++channel) {
      LMIC_disableChannel(channel);
    }

      LMIC_enableChannel(48);
      LMIC_enableChannel(49);
      LMIC_enableChannel(50);
      LMIC_enableChannel(51);
      LMIC_enableChannel(52);
      LMIC_enableChannel(53);
      LMIC_enableChannel(54);
      LMIC_enableChannel(55);
      LMIC_enableChannel(70);

      // TTN uses SF9 for its RX2 window. This is configured in the
      // join accept message, but the LMIC library does not currently
      // process this part of the join accept yet (see Arduino-LMIC issue #20).
      LMIC.dn2Dr = DR_SF9;

      // Use a fixed data rate of SF9 (not sure if tx power is
      // actually used). SF9 is the lowest datarate that (withing the
      // TTN fair-usage-policy of 30 seconds of airtime per day)
      // allows us to send at least 4 packets every hour.
      LMIC_setDrTxpow(DR_SF7, 14);

      // Let LMIC compensate for +/- 1% clock error
      LMIC_setClockError(MAX_CLOCK_ERROR * 1 / 100);

      // Start job (sending automatically starts OTAA too)
      do_send(&sendjob);

}

/*--------------------------------------------------------------------------------------
  loop
  Arduino architecture main loop
--------------------------------------------------------------------------------------*/
void loop(void)
{
  os_runloop_once();
/*  box.clear();
  box.print("Ruta: 40");
  delay(2000);
  box.clear();
  box.print("Tiempo: 5m");
  delay(2000);
      delay(200);*/

}
