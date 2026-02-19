import { ThemedText } from '@/components/themed-text'
import { Fonts } from '@/constants/theme'
import { useTheme } from '@/hooks/useTheme'
import { MaterialIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React from 'react'
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const INTRO_PARAGRAPHS = [
    'These Terms of Service ("Terms") govern your access to and use of the WASHUB mobile application and related services (collectively, the "Platform", "Service", or "App"). By creating an account, booking services, or using WASHUB in any way, you ("User", "You", "Customer") agree to be bound by these Terms.',
    'IF YOU DO NOT AGREE TO THESE TERMS, DO NOT USE THE WASHUB PLATFORM.',
];

const META_ITEMS = [
    'Effective Date: February 16, 2026',
    'Governing Law: Federal Republic of Nigeria',
];

const TERMS_SECTIONS = [
    {
        title: '1. Definitions',
        clauses: [
            '1.1 "WASHUB", "We", "Us", "Our" refers to WASHUB, a company incorporated in Nigeria.',
            '1.2 "User", "You", "Your" refers to any person who accesses or uses the WASHUB Platform.',
            '1.3 "Service Provider", "Technician", "Washer" refers to independent contractors or company employees who provide car wash services through the Platform.',
            '1.4 "Services" refers to all car wash, detailing, and related automotive cleaning services offered through WASHUB.',
            '1.5 "Account" refers to your registered user profile on the Platform.',
        ],
    },
    {
        title: '2. Eligibility & Account Registration',
        clauses: [
            '2.1 Age Requirement: You must be at least 18 years old to create an account and use WASHUB services.',
            '2.2 Accurate Information: You agree to provide accurate, complete, and current information during registration and booking. False or misleading information may result in account suspension or termination.',
            '2.3 Account Security: You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.',
            '2.4 One Account Per User: Each individual may maintain only one active account. Multiple accounts for abuse, fraud, or circumventing policies are prohibited.',
            '2.5 Account Verification: WASHUB reserves the right to verify your identity through phone number verification, email confirmation, or additional documentation if needed.',
        ],
    },
    {
        title: '3. Services Offered',
        clauses: [
            '3.1 Marketplace Platform: WASHUB operates as a technology platform connecting Users with Service Providers. We facilitate bookings but do not directly provide car wash services ourselves (except where specified).',
            '3.2 Service Availability: Services are subject to availability based on location, time, and technician capacity. WASHUB does not guarantee service availability at all times.',
            '3.3 Service Modifications: We reserve the right to modify, suspend, or discontinue any service, feature, or pricing at any time without prior notice.',
            '3.4 Geographic Limitations: Services are currently available only in specified areas of Lagos State, Nigeria. Service areas may expand or contract based on operational needs.',
            '3.5 Right to Refuse Service: WASHUB reserves the right to refuse service to any User for any lawful reason, including but not limited to: unsafe locations, aggressive behavior, fraudulent activity, or repeated policy violations.',
        ],
    },
    {
        title: '4. Booking & Scheduling',
        clauses: [
            '4.1 Booking Process: All bookings must be made through the WASHUB mobile application. Verbal, SMS, or third-party bookings are not valid.',
            '4.2 Booking Confirmation: A booking is confirmed only when you receive an in-app confirmation and payment is processed successfully.',
            '4.3 Accurate Details: You must provide accurate vehicle information, location details, and special instructions. Inaccurate information may result in service delays or cancellation without refund.',
            '4.4 Rescheduling by WASHUB: We may reschedule your booking due to: severe weather, safety concerns, technician unavailability, or access restrictions. You will be notified immediately and offered alternative slots or a full refund.',
            '4.5 Third-Party Bookings: If booking on behalf of another person, you are responsible for ensuring they agree to these Terms and provide accurate information.',
        ],
    },
    {
        title: '5. Payments, Pricing & Fees',
        clauses: [
            '5.1 Payment Authorization: By confirming a booking, you authorize WASHUB to charge the total amount displayed, including service fees, VAT, and any applicable additional charges.',
            '5.2 Pricing Transparency: All prices are displayed in Nigerian Naira (N) before booking confirmation. Prices include: (a) Service fee, (b) Platform/convenience fee, (c) VAT (7.5%), (d) Distance surcharge (if applicable).',
            '5.3 Price Changes: Prices may change due to promotions, demand, or operational adjustments. The price you pay is the amount displayed at the time of booking confirmation.',
            '5.4 Failed Payments: If payment fails, your booking will be automatically canceled. You must rebook and complete payment to schedule service.',
            '5.5 Subscription Billing: Subscription plans auto-renew and charge your payment method on file until canceled. You will receive a renewal reminder 3 days before billing.',
            '5.6 Fraudulent Transactions: Any attempt to manipulate pricing, use stolen payment methods, or commit payment fraud will result in immediate account termination and legal action.',
        ],
    },
    {
        title: '6. Cancellations & Refunds',
        clauses: [
            '6.1 Cancellation by User: Free cancellation more than 2 hours before scheduled service time. Late cancellation fee: N500 if canceled within 2 hours of service time. No-show fee: 50% of booking amount if technician arrives and you are unavailable.',
            '6.2 Cancellation by WASHUB: If we cancel your booking (weather, technical issues, etc.), you will receive a full refund plus inconvenience credit.',
            '6.3 Refund Processing: Refunds are processed within 1-2 business days but may take 5-7 days to appear in your account depending on your bank.',
            '6.4 Non-Refundable Services: Promotional credits, referral bonuses, and certain discounted bookings may be non-refundable as specified at booking.',
            '6.5 Subscription Cancellations: You can cancel subscriptions anytime. Remaining unused washes are forfeited upon cancellation unless converted to one-time bookings (at regular price).',
        ],
    },
    {
        title: '7. Service Quality & Standards',
        clauses: [
            '7.1 Quality Commitment: WASHUB strives to provide high-quality services but does not guarantee perfection due to factors such as pre-existing vehicle condition, environmental limitations, or access constraints.',
            '7.2 Service Complaints: You must report service quality issues within 24 hours of service completion via the app. Late reports may not be eligible for resolution.',
            '7.3 Resolution Options: Depending on the issue, we may offer: (a) Free rewash, (b) Partial refund, (c) Service credit, (d) Account suspension of the technician.',
            '7.4 Pre-Existing Damage: Service Providers are not responsible for pre-existing scratches, dents, mechanical issues, or wear and tear. You should note these in the app before service.',
            '7.5 User Cooperation: You agree to provide reasonable access, water supply (if required), and safe working conditions. Services may be canceled without refund if conditions are unsafe or inaccessible.',
        ],
    },
    {
        title: '8. Liability & Limitations',
        clauses: [
            '8.1 Platform Limitations: WASHUB acts as an intermediary platform. While we vet Service Providers, we do not control their work and are not liable for acts or omissions beyond our reasonable control.',
            '8.2 Not Liable For: Pre-existing vehicle damage or defects, mechanical/electrical/electronic faults, damage to modified or aftermarket parts, loss or theft of valuables left inside vehicle, delays due to traffic/weather/external factors, acts of third parties (theft, vandalism) at service location.',
            '8.3 Maximum Liability: WASHUB total liability for any claim arising from or related to the Services is limited to the amount you paid for the specific service in question, not to exceed N50,000 per incident.',
            '8.4 Exclusion of Consequential Damages: WASHUB is not liable for indirect, incidental, special, consequential, or punitive damages including loss of profits, revenue, data, or business opportunities.',
            '8.5 Insurance Coverage: Service Providers carry liability insurance. Legitimate damage claims will be processed through our insurance partners subject to verification and policy terms.',
        ],
    },
    {
        title: '9. User Responsibilities',
        clauses: [
            '9.1 Vehicle Condition: You must ensure your vehicle is in a roadworthy and accessible condition. Service Providers may refuse service if the vehicle poses safety risks.',
            '9.2 Remove Valuables: You are solely responsible for removing all personal belongings, valuables, cash, electronics, and important documents from your vehicle before service.',
            '9.3 Accurate Location: Provide accurate location details, access codes, parking information, and any special instructions. Service delays due to inaccurate information are your responsibility.',
            '9.4 Respectful Conduct: You agree to treat Service Providers with respect. Harassment, threats, discrimination, or abusive behavior will result in immediate account termination.',
            '9.5 Compliance with Laws: You will not use WASHUB services for any illegal purpose or in violation of Nigerian laws.',
        ],
    },
    {
        title: '10. Damage Claims & Dispute Resolution',
        clauses: [
            '10.1 Reporting Damage: If you believe damage occurred during service, you must: Report within 24 hours via the app, provide clear photos/videos showing the damage, allow WASHUB to investigate, cooperate with our claims process.',
            '10.2 Investigation: WASHUB will investigate all claims fairly. We may request additional documentation, inspect the vehicle, or interview the Service Provider.',
            '10.3 False Claims: Submitting false or fraudulent claims may result in account suspension, legal action, and liability for investigation costs.',
            '10.4 Dispute Resolution: Disputes will be resolved through good-faith negotiation. If unresolved, disputes are subject to binding arbitration under Nigerian law.',
            '10.5 Claims Processing Time: Legitimate claims are typically resolved within 7-14 business days, subject to investigation complexity and insurance processing.',
        ],
    },
    {
        title: '11. Prohibited Activities',
        clauses: [
            '11.1 You may not: Use the Platform for illegal, fraudulent, or unauthorized purposes; Impersonate another person or entity; Harass, threaten, or abuse Service Providers or WASHUB staff; Provide false information or create fake bookings; Attempt to circumvent security measures or hack the Platform; Reverse engineer, decompile, or extract source code from the app; Use automated tools (bots, scrapers) to access the Platform; Resell, redistribute, or commercially exploit WASHUB services without authorization; Post or transmit harmful content (viruses, malware, spam); Manipulate reviews, ratings, or feedback systems.',
            '11.2 Consequences: Violation of prohibited activities may result in: (a) Immediate account suspension or termination, (b) Forfeiture of credits and refunds, (c) Legal action and liability for damages, (d) Reporting to law enforcement authorities.',
        ],
    },
    {
        title: '12. Intellectual Property',
        clauses: [
            '12.1 Ownership: All content, features, functionality, trademarks, logos, and technology on the WASHUB Platform are owned by WASHUB Limited and protected by Nigerian and international intellectual property laws.',
            '12.2 Limited License: WASHUB grants you a limited, non-exclusive, non-transferable license to access and use the app for personal, non-commercial purposes.',
            '12.3 Restrictions: You may not: (a) Copy, modify, or create derivative works, (b) Distribute, sell, or sublicense any part of the Platform, (c) Use WASHUB branding without written permission, (d) Remove or obscure proprietary notices.',
            '12.4 User Content: By submitting reviews, photos, or feedback, you grant WASHUB a worldwide, royalty-free license to use, reproduce, and display such content for promotional and operational purposes.',
        ],
    },
    {
        title: '13. Changes to Terms',
        clauses: [
            '13.1 Right to Modify: WASHUB reserves the right to modify, update, or replace these Terms at any time without prior individual notice.',
            '13.2 Notification: Material changes will be communicated via: (a) In-app notification, (b) Email to registered address, (c) Notice on our website.',
            '13.3 Acceptance: Continued use of the Platform after changes constitutes acceptance of the modified Terms. If you disagree with changes, discontinue use immediately.',
        ],
    },
    {
        title: '14. Account Suspension & Termination',
        clauses: [
            '14.1 Termination by User: You may close your account anytime through app settings. Outstanding payments and obligations survive termination.',
            '14.2 Termination by WASHUB: We may suspend or terminate your account immediately without notice if you violate these Terms, engage in fraudulent activity, abuse staff or Service Providers, create safety risks, or have repeated payment failures.',
            '14.3 Effect of Termination: Upon termination, access to the Platform is revoked, unused subscription washes are forfeited, wallet balance may be refunded (minus applicable deductions), and your data may be retained for legal purposes.',
        ],
    },
    {
        title: '15. Governing Law & Jurisdiction',
        clauses: [
            '15.1 Governing Law: These Terms are governed by and construed in accordance with the laws of the Federal Republic of Nigeria.',
            '15.2 Jurisdiction: Any disputes arising from these Terms or your use of WASHUB shall be subject to the exclusive jurisdiction of Nigerian courts.',
            '15.3 Arbitration: Before initiating court proceedings, parties agree to attempt resolution through good-faith negotiation. If unresolved within 30 days, disputes may be submitted to binding arbitration under the Arbitration and Mediation Act of Nigeria.',
            '15.4 Class Action Waiver: You agree to resolve disputes individually. You waive the right to participate in class-action lawsuits or class-wide arbitration against WASHUB.',
        ],
    },
    {
        title: '16. Force Majeure',
        clauses: [
            '16.1 WASHUB is not liable for failure to perform obligations due to events beyond reasonable control including: natural disasters, civil unrest, government actions, pandemics, labor strikes, telecommunications failures, or other force majeure events. During force majeure events, WASHUB may suspend services temporarily.',
        ],
    },
    {
        title: '17. Severability',
        clauses: [
            '17.1 If any provision of these Terms is held invalid or unenforceable, the remaining provisions will continue in full force and effect.',
        ],
    },
    {
        title: '18. Entire Agreement',
        clauses: [
            '18.1 These Terms, together with our Privacy Policy and any supplemental terms for specific services, constitute the entire agreement between you and WASHUB regarding use of the Platform.',
        ],
    },
    {
        title: '19. Contact Information',
        clauses: [
            '19.1 For questions, concerns, or notices regarding these Terms, contact:',
            'WASHUB',
            'Customer Service Department',
            'Email: legal@washub.ng',
            'Phone: +234 XXX XXX XXXX',
            'Address: [Insert Company Address, Lagos, Nigeria]',
            'Customer Support:',
            'Email: support@washub.ng',
            'In-App Chat: Available 9 AM - 7 PM (Mon-Sat)',
        ],
    },
] as const;

const ACCEPTANCE_BLOCK = [
    'ACCEPTANCE OF TERMS',
    'BY CREATING AN ACCOUNT, BOOKING A SERVICE, OR USING THE WASHUB PLATFORM, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THESE TERMS OF SERVICE AND OUR PRIVACY POLICY.',
    'If you have questions about these Terms, please contact us at legal@washub.ng before using our services.',
    'Last Updated: February 16, 2026',
    '(C) 2026 a product of BASH SYSTEMS LIMITED. All rights reserved.',
] as const;

export default function Terms() {
    const colors = useTheme();
    const router = useRouter();
    return (
        <SafeAreaView
            style={[styles.container, { backgroundColor: colors.background }]}
            edges={["top"]}
        >
            <StatusBar barStyle={colors.statusBarStyle} />
            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View style={styles.header}>
                    <Pressable
                        style={[
                            styles.backButton,
                            { backgroundColor: colors.card, shadowColor: colors.shadow },
                        ]}
                        onPress={() => router.back()}
                    >
                        <MaterialIcons
                            name="arrow-back-ios"
                            size={18}
                            color={colors.primary}
                        />
                    </Pressable>
                    <ThemedText style={[styles.headerTitle, { color: colors.title }]}>
                        Terms & Conditions
                    </ThemedText>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={{ paddingHorizontal: 20, rowGap: 4, marginBottom: 12 }}>
                    <ThemedText style={{ color: colors.textMuted, textAlign: "center" }}>Version 1.0 I February 16, 2026</ThemedText>
                </View>
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    {INTRO_PARAGRAPHS.map((paragraph) => (
                        <ThemedText key={paragraph} style={[styles.paragraph, { color: colors.text }]}>
                            {paragraph}
                        </ThemedText>
                    ))}

                    <View style={styles.metaWrap}>
                        {META_ITEMS.map((item) => (
                            <ThemedText key={item} style={[styles.metaText, { color: colors.textMuted }]}>
                                {item}
                            </ThemedText>
                        ))}
                    </View>

                    {TERMS_SECTIONS.map((section) => (
                        <View key={section.title} style={styles.sectionWrap}>
                            <ThemedText style={[styles.sectionTitle, { color: colors.title }]}>
                                {section.title}
                            </ThemedText>
                            {section.clauses.map((clause) => (
                                <ThemedText key={clause} style={[styles.clauseText, { color: colors.text }]}>
                                    {clause}
                                </ThemedText>
                            ))}
                        </View>
                    ))}

                    <View style={[styles.acceptanceWrap, { borderTopColor: colors.borderLight }]}> 
                        <ThemedText style={[styles.acceptanceTitle, { color: colors.title }]}> 
                            {ACCEPTANCE_BLOCK[0]}
                        </ThemedText>
                        {ACCEPTANCE_BLOCK.slice(1).map((line) => (
                            <ThemedText key={line} style={[styles.acceptanceText, { color: colors.text }]}> 
                                {line}
                            </ThemedText>
                        ))}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 18,
        paddingBottom: 32,
        rowGap: 10,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 6,
        paddingBottom: 8,
    },
    backButton: {
        width: 36,
        height: 36,
        flex: 0,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 18,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 10,
        elevation: 2,
    },
    headerTitle: {
        flex: 1,
        textAlign: "center",
        fontSize: 18,
        fontFamily: Fonts.subtitle,
    },
    flex: {
        flex: 1,
    },
    headerSpacer: {
        width: 36, // Same width as back button to center the title
    },
    paragraph: {
        fontSize: 14,
        lineHeight: 22,
        fontFamily: Fonts.body,
    },
    metaWrap: {
        marginTop: 4,
        marginBottom: 6,
        rowGap: 4,
    },
    metaText: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: Fonts.body,
    },
    sectionWrap: {
        marginTop: 6,
    },
    sectionTitle: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: Fonts.subtitle,
        marginBottom: 8,
    },
    clauseText: {
        fontSize: 13,
        lineHeight: 21,
        fontFamily: Fonts.body,
        marginBottom: 8,
    },
    acceptanceWrap: {
        marginTop: 10,
        paddingTop: 14,
        borderTopWidth: 1,
        rowGap: 8,
    },
    acceptanceTitle: {
        fontSize: 14,
        lineHeight: 20,
        fontFamily: Fonts.subtitle,
    },
    acceptanceText: {
        fontSize: 13,
        lineHeight: 20,
        fontFamily: Fonts.body,
    },

})