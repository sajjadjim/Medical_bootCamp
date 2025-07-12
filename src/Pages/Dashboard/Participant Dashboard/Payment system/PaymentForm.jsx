import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'react-router';
import { use } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../../../Hook/useAxiosSecure';
import { AuthContext } from '../../../../Auth/AuthContext';

const PaymentForm = () => {

    const { user } = use(AuthContext)

    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure()

    // taken from react stripe docs 
    const stripe = useStripe()
    const elements = useElements()

    const { campId } = useParams();
    // console.log(campId)


    // Data tank using TransSteck query 
    const { data: campsInfo } = useQuery({
        queryKey: ['parcel', campId],
        queryFn: async () => {
            const res = await axiosSecure(`registrations/${campId}`)
            return res.data
        }
    })
//  console.log("Details Registration", campsInfo)

    const amount = campsInfo?.campFees;
    const amountInCents = amount * 100; // Convert to cents for Stripe
    // console.log("Amount in Cents", amountInCents)


    // control here the form submit button data for payment method system 
    const handleSubmit = async (e) => {
        e.preventDefault();

        // if your have don't payment elements your can not payment  if user have don't payment elements then return
        if (!stripe || !elements)
            return;

        const card = elements.getElement(CardElement);
        // console.log("Card information", card)

        if (!card) {
            return
        }

        // step -1 : Validation the card information 
        const { erro, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        })

        if (erro) {
            console.log(erro)
        }
        else {
            console.log("Payment method", paymentMethod)
            // step-2 : Payment intent creation
        const res = await axiosSecure.post('/create-payment-intent', {
            amountInCents,
            campId,
        });
        // console.log("Intent send Backend ", res)
        const clientSecret = res.data.clientSecret;
        // step-3: confirm payment
        const result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                    name: user.displayName,
                    email: user.email
                },
            },
        });
        // AFter payment done show the massage 
        if (result.error) {
            setError(result.error.message);
        } else {
            setError('');
            if (result.paymentIntent.status === 'succeeded') {
                console.log('Payment succeeded Done ✅!');
                // console.log(result)
                // payment data on the store and history that show the payment success message
                const paymentData = {
                    campId: campId,
                    campName: campsInfo?.campName,
                    email: user.email,
                    amount: amount,
                    transactionId: result.paymentIntent.id,
                    paymentMethod: result.paymentIntent.payment_method_types?.[0] || result.type,
                }
                console.log(paymentData)
                const paymentRes = await axiosSecure.post('/payments', paymentData);
                // console.log("Payment data send to backend", paymentRes.data);
                if(paymentRes.data.insertedId) {
                    // ✅ Show SweetAlert with transaction ID
                        await Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            html: `<strong>Transaction ID:</strong> <code>${paymentData.transactionId}</code>`,
                            confirmButtonText: 'Go to My Parcels',
                        });

                        // ✅ Redirect to /myParcels
                        navigate('/dashboard/registered-camps');
                    // Optionally, redirect or update UI here
                }
            }
        }
        }

    }
    // State for error message
    const [error, setError] = React.useState("");

    return (
        <div className="max-w-md mx-auto p-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 bg-white shadow-xl rounded-xl p-8">
                <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">Payment Details</h2>
                <div className="space-y-4">
                    <label className="block">
                        <span className="text-gray-700 font-semibold">Card Information</span>
                        <div className="mt-2 rounded-lg border border-gray-300 bg-gray-50 px-3 py-4 focus-within:border-blue-500 transition-all
                            md:w-[420px] md:max-w-full">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "17px",
                                            color: "#1e293b",
                                            letterSpacing: "0.025em",
                                            "::placeholder": { color: "#94a3b8" },
                                            fontFamily: "inherit",
                                            backgroundColor: "#f8fafc",
                                            padding: "10px 0"
                                        },
                                        invalid: { color: "#ef4444" }
                                    },
                                    hidePostalCode: true,
                                }}
                                className="bg-transparent"
                                onChange={e => setError(e.error ? e.error.message : "")}
                            />
                        </div>
                    </label>
                    {error && (
                        <div className="text-red-500 text-sm font-medium mt-1">{error}</div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Visa</span>
                        <span className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">Mastercard</span>
                    </div>
                </div>
                <button
                    type='submit'
                    disabled={!stripe}
                    className={`w-full cursor-pointer py-3 btn-primary text-gray-600 rounded-lg font-bold text-lg shadow-md transition-all ${!stripe ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:to-blue-600"
                        }`}
                >
                    Pay {amount ? `Taka ${amount}` : "0.00"}
                </button>
                <div className="text-xs text-gray-400 text-center mt-2">
                    Your payment is secure and encrypted.
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;