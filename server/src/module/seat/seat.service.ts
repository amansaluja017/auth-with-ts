import { db } from "../../db";
import {
  invoiceTable,
  paymentTable,
  screensTable,
  seatsTable,
  seatStatusTable,
  showsTable,
  ticketTable,
} from "../../db/schema";
import { eq, inArray } from "drizzle-orm";
import ApiError from "../../common/utils/api-error";
import { and } from "drizzle-orm";
import razorpay from "../../common/utils/razorpay.config";

type PaymentMethod = "upi" | "card" | "netbanking" | "wallet";

export const getSeatsService = async ({ showId }: { showId: string }) => {
  const [show] = await db
    .select()
    .from(showsTable)
    .where(and(eq(showsTable.showId, showId), eq(showsTable.showId, showId)));

  if (!show) throw ApiError.badRequest("Invaid request, no show found");

  const seats = await db
    .select({
      seatId: seatStatusTable.seatId,
      seatStatus: seatStatusTable.seatStatus,
      showId: seatStatusTable.showId,
      seatName: seatsTable.seatName,
      seatPrice: seatsTable.seatPrice,
      seatType: seatsTable.seatType,
      screenId: screensTable.screenId,
      screenName: screensTable.screenName,
      screenType: screensTable.screenType,
    })
    .from(seatStatusTable)
    .innerJoin(seatsTable, eq(seatsTable.seatId, seatStatusTable.seatId))
    .innerJoin(screensTable, eq(screensTable.screenId, seatsTable.screenId))
    .where(eq(seatStatusTable.showId, show.showId));

  if (!seats)
    throw ApiError.internalError(
      "Internal Error: Failed to fetch seats, try again later after some time",
    );

  return { seats, show };
};

export const bookSeatsService = async ({
  seatIds,
  showId,
  userId,
  paymentId,
}: {
  seatIds: string[];
  showId: string;
  userId: string;
  paymentId: string;
}) => {
  const payment = await razorpay.payments.fetch(paymentId);

  if (payment.status !== "captured") {
    throw ApiError.internalError("Payment not captured");
  }

  const [paymentData] = await db
    .insert(paymentTable)
    .values({
      userId,
      transactionId: payment.id,
      paymentMethod: payment.method as PaymentMethod,
      amount: Number(payment.amount) / 100,
      paymentStatus: "success",
    })
    .returning();
  
  if (!paymentData) {
    throw ApiError.internalError("Payment data not found");
  }

  await db.insert(invoiceTable).values({
    userId,
    paymentId: paymentData?.paymentId!,
  });

  await db.transaction(async (tx) => {
    const seat = await tx
      .select()
      .from(seatStatusTable)
      .where(
        and(
          eq(seatStatusTable.showId, showId),
          inArray(seatStatusTable.seatId, seatIds),
          eq(seatStatusTable.seatStatus, "booked"),
        ),
      )
      .for("update");

    if (seat.length) throw ApiError.badRequest("seat is already booked");

    await tx
      .update(seatStatusTable)
      .set({ seatStatus: "booked", userId, paymentId: paymentData?.paymentId! })
      .where(
        and(
          eq(seatStatusTable.showId, showId),
          inArray(seatStatusTable.seatId, seatIds),
        ),
      );

    await tx
      .insert(ticketTable)
      .values(seatIds.map((seatId) => ({ userId, seatId, showId, paymentId: paymentData.paymentId })));
  });
};
