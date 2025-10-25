package com.crmmobile

import android.provider.CallLog
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Arguments

class CallLogsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "CallLogsModule"
    }

    @ReactMethod
    fun getCallLogs(limit: Int, promise: Promise) {
        try {
            val callLogArray = Arguments.createArray()
            
            val projection = arrayOf(
                CallLog.Calls.NUMBER,
                CallLog.Calls.CACHED_NAME,
                CallLog.Calls.TYPE,
                CallLog.Calls.DATE,
                CallLog.Calls.DURATION
            )

            val sortOrder = "${CallLog.Calls.DATE} DESC"

            val cursor = reactApplicationContext.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                projection,
                null,
                null,
                sortOrder
            )

            cursor?.use {
                val numberIndex = it.getColumnIndex(CallLog.Calls.NUMBER)
                val nameIndex = it.getColumnIndex(CallLog.Calls.CACHED_NAME)
                val typeIndex = it.getColumnIndex(CallLog.Calls.TYPE)
                val dateIndex = it.getColumnIndex(CallLog.Calls.DATE)
                val durationIndex = it.getColumnIndex(CallLog.Calls.DURATION)

                var count = 0
                while (it.moveToNext() && count < limit) {
                    val callLog = Arguments.createMap()

                    val number = it.getString(numberIndex)
                    val name = it.getString(nameIndex)
                    val type = it.getInt(typeIndex)
                    val date = it.getLong(dateIndex)
                    val duration = it.getInt(durationIndex)

                    val callType = when (type) {
                        CallLog.Calls.INCOMING_TYPE -> "INCOMING"
                        CallLog.Calls.OUTGOING_TYPE -> "OUTGOING"
                        CallLog.Calls.MISSED_TYPE -> "MISSED"
                        CallLog.Calls.REJECTED_TYPE -> "REJECTED"
                        else -> "UNKNOWN"
                    }

                    callLog.putString("phoneNumber", number ?: "Unknown")
                    callLog.putString("name", name)
                    callLog.putString("type", callType)
                    callLog.putDouble("date", date.toDouble())
                    callLog.putInt("duration", duration)

                    callLogArray.pushMap(callLog)
                    count++
                }
            }

            promise.resolve(callLogArray)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to fetch call logs: ${e.message}", e)
        }
    }

    @ReactMethod
    fun getTopContactsByDuration(limit: Int, promise: Promise) {
        try {
            val contactDurations = mutableMapOf<String, ContactStats>()
            
            val projection = arrayOf(
                CallLog.Calls.NUMBER,
                CallLog.Calls.CACHED_NAME,
                CallLog.Calls.DURATION
            )

            val cursor = reactApplicationContext.contentResolver.query(
                CallLog.Calls.CONTENT_URI,
                projection,
                null,
                null,
                null
            )

            cursor?.use {
                val numberIndex = it.getColumnIndex(CallLog.Calls.NUMBER)
                val nameIndex = it.getColumnIndex(CallLog.Calls.CACHED_NAME)
                val durationIndex = it.getColumnIndex(CallLog.Calls.DURATION)

                while (it.moveToNext()) {
                    val number = it.getString(numberIndex) ?: "Unknown"
                    val name = it.getString(nameIndex)
                    val duration = it.getInt(durationIndex)

                    val displayName = name ?: number
                    val key = "$displayName|$number"

                    if (contactDurations.containsKey(key)) {
                        val stats = contactDurations[key]!!
                        contactDurations[key] = ContactStats(
                            displayName,
                            number,
                            stats.totalDuration + duration,
                            stats.callCount + 1
                        )
                    } else {
                        contactDurations[key] = ContactStats(displayName, number, duration, 1)
                    }
                }
            }

            // Sort by total duration and take top N
            val topContacts = contactDurations.values
                .sortedByDescending { it.totalDuration }
                .take(limit)

            val resultArray = Arguments.createArray()
            topContacts.forEach { stats ->
                val contactMap = Arguments.createMap()
                contactMap.putString("name", stats.name)
                contactMap.putString("phoneNumber", stats.phoneNumber)
                contactMap.putInt("totalDuration", stats.totalDuration)
                contactMap.putInt("callCount", stats.callCount)
                resultArray.pushMap(contactMap)
            }

            promise.resolve(resultArray)
        } catch (e: Exception) {
            promise.reject("ERROR", "Failed to fetch top contacts: ${e.message}", e)
        }
    }

    private data class ContactStats(
        val name: String,
        val phoneNumber: String,
        val totalDuration: Int,
        val callCount: Int
    )
}