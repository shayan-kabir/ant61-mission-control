export interface Message {
  uid: string;
  created_at: string;
  direction: string;
  payload_length: number;
  payload_crc: number;
  payload_string: string;
}

export interface MessagesResponse {
  message: Message[];

}