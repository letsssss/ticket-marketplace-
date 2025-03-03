import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar } from "lucide-react"

// 이 데이터는 실제로는 API나 데이터베이스에서 가져와야 합니다.
const ticketData = {
  id: 1,
  title: "세븐틴 'FOLLOW' TO SEOUL",
  artist: "세븐틴",
  venue: "잠실종합운동장 주경기장",
  description: "세븐틴의 새 월드투어 'FOLLOW'의 서울 공연입니다. 13명의 멤버들과 함께하는 특별한 밤을 만나보세요.",
  image: "/placeholder.svg",
  tickets: [
    {
      id: 1,
      date: "2024.03.20",
      time: "18:30",
      section: "E50구역",
      row: "7",
      grade: "S",
      floor: "4층 (4F)",
      price: 150000,
      quantity: 1,
      tags: ["판매자가 입장 도움"],
      status: "판매중",
    },
    {
      id: 2,
      date: "2024.03.20",
      time: "18:30",
      section: "E59구역",
      row: "6",
      grade: "S",
      floor: "4층 (4F)",
      price: 155000,
      quantity: 1,
      tags: ["예매처 ID로 실물 전달"],
      status: "판매중",
    },
    {
      id: 3,
      date: "2024.03.21",
      time: "18:30",
      section: "E50구역",
      row: "6",
      grade: "S",
      floor: "4층 (4F)",
      price: 150000,
      quantity: 1,
      tags: ["판매자가 입장 도움"],
      status: "판매중",
    },
    {
      id: 4,
      date: "2024.03.21",
      time: "18:30",
      section: "E59구역",
      row: "6",
      grade: "S",
      floor: "4층 (4F)",
      price: 155000,
      quantity: 1,
      tags: ["예매처 ID로 실물 전달"],
      status: "판매중",
    },
  ],
}

export default function TicketDetail({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5 mr-2" />
            <span>홈으로 돌아가기</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-8">
            <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">{ticketData.artist}</div>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{ticketData.title}</h1>
            <p className="mt-4 text-gray-500">{ticketData.description}</p>
            <div className="mt-6 space-y-6">
              {ticketData.tickets.map((ticket) => (
                <Link
                  href={`/order?ticketId=${params.id}&seat=${ticket.id}`}
                  key={ticket.id}
                  className="block mb-4 last:mb-0"
                >
                  <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="flex">
                      <div className="w-48 relative">
                        <Image
                          src={ticketData.image || "/placeholder.svg"}
                          alt={`${ticketData.title} - ${ticket.section} ${ticket.row}열`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-4 flex items-center">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <Calendar className="h-5 w-5 text-gray-500" />
                            <span className="font-medium">
                              {ticket.date} {ticket.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                            <span>{ticket.section}</span>
                            <span>•</span>
                            <span>{ticket.row}열</span>
                            <span>•</span>
                            <span>{ticket.grade}석</span>
                            <span>•</span>
                            <span>{ticket.floor}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {ticket.tags.map((tag, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col items-end justify-between ml-4 min-w-[120px]">
                          <div className="text-right">
                            <div className="text-sm text-gray-500 mb-1">{ticket.quantity}장</div>
                            <div className="text-lg font-bold text-orange-500">₩{ticket.price.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

